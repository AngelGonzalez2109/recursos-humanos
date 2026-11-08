import { useState } from 'react'
import type { PostulacionConMatch } from '../../lib/match'
import type { ResultadoPsicometrico } from '../../types/examen'
import { GRADO_ACADEMICO_LABELS, NIVEL_ESTUDIOS_LABELS } from '../../lib/perfilOptions'
import { ESTADO_POSTULACION_LABELS, ESTADO_POSTULACION_VARIANT } from '../../lib/postulacionEstados'
import { getCvUrl } from '../../lib/postulacionesService'
import { formatFechaRelativa, normalize } from '../../lib/vacanteFormat'
import { Alert } from '../ui/Alert'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { DesglosePsicometrico } from './DesglosePsicometrico'
import { EstadoPostulacionSelect } from './EstadoPostulacionSelect'
import { MatchIndicator } from './MatchIndicator'

interface PostulacionCardProps {
  item: PostulacionConMatch
  resultado?: ResultadoPsicometrico
  onChanged: () => void
}

/** Tarjeta de un candidato: identidad, compatibilidad, perfil, habilidades y gestión de estado */
export function PostulacionCard({ item: { postulacion, match }, resultado, onChanged }: PostulacionCardProps) {
  const [opening, setOpening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function openCv() {
    setOpening(true)
    setError(null)
    try {
      window.open(await getCvUrl(postulacion.cv_path), '_blank', 'noopener,noreferrer')
    } catch (err) {
      console.error('Error al abrir el CV:', err)
      setError('No se pudo abrir el CV. Inténtalo de nuevo.')
    } finally {
      setOpening(false)
    }
  }

  const nombre = postulacion.postulante_nombre || 'Candidato'
  const datos = [
    postulacion.edad !== null && `${postulacion.edad} años`,
    postulacion.nivel_estudios && NIVEL_ESTUDIOS_LABELS[postulacion.nivel_estudios],
    postulacion.grado_academico && GRADO_ACADEMICO_LABELS[postulacion.grado_academico],
    postulacion.experiencia_anios !== null && `${postulacion.experiencia_anios} años de experiencia`,
  ].filter(Boolean) as string[]
  const coincidentes = new Set(match.habilidadesCoincidentes.map(normalize))

  return (
    <li className="surface surface-interactive animate-fade-in space-y-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={nombre} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-serif text-2xl leading-tight text-slate-900 dark:text-slate-100">{nombre}</p>
              <Badge variant={ESTADO_POSTULACION_VARIANT[postulacion.estado]}>
                {ESTADO_POSTULACION_LABELS[postulacion.estado]}
              </Badge>
            </div>
            <p className="eyebrow mt-1">
              Se postuló {formatFechaRelativa(postulacion.created_at)}
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={openCv} loading={opening}>
          Ver CV
        </Button>
      </div>

      <MatchIndicator match={match} />

      {resultado && <DesglosePsicometrico resultado={resultado} />}
      {!resultado && postulacion.estado === 'pruebas_psicometricas' && (
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Evaluación de Perfil Profesional pendiente: el candidato aún no la presenta.
        </p>
      )}

      {datos.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {datos.map((d) => (
            <Badge key={d}>{d}</Badge>
          ))}
        </div>
      )}

      {postulacion.habilidades.length > 0 && (
        <div>
          <p className="eyebrow mb-2">
            Habilidades
          </p>
          <div className="flex flex-wrap gap-1.5">
            {postulacion.habilidades.map((h) => {
              const match = coincidentes.has(normalize(h))
              return (
                <Badge key={h} variant={match ? 'brand' : 'muted'}>
                  {match && '✓ '}
                  {h}
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      {postulacion.mensaje && (
        <p className="inset-panel px-4 py-3 text-sm whitespace-pre-line text-slate-700 dark:text-slate-300">
          {postulacion.mensaje}
        </p>
      )}
      {error && <Alert variant="error">{error}</Alert>}

      <div className="hairline-t pt-4">
        <EstadoPostulacionSelect postulacion={postulacion} onChanged={onChanged} />
      </div>
    </li>
  )
}
