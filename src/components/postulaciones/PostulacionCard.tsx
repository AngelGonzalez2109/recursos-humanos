import { useState } from 'react'
import type { PostulacionConMatch } from '../../lib/match'
import { GRADO_ACADEMICO_LABELS, NIVEL_ESTUDIOS_LABELS } from '../../lib/perfilOptions'
import { ESTADO_POSTULACION_LABELS, ESTADO_POSTULACION_VARIANT } from '../../lib/postulacionEstados'
import { getCvUrl } from '../../lib/postulacionesService'
import { formatFechaRelativa } from '../../lib/vacanteFormat'
import { Alert } from '../ui/Alert'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { EstadoPostulacionSelect } from './EstadoPostulacionSelect'
import { MatchIndicator } from './MatchIndicator'

interface PostulacionCardProps {
  item: PostulacionConMatch
  onChanged: () => void
}

/** Tarjeta de un candidato: datos, compatibilidad, CV y cambio de estado */
export function PostulacionCard({ item: { postulacion, match }, onChanged }: PostulacionCardProps) {
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

  const datos = [
    postulacion.edad !== null && `${postulacion.edad} años`,
    postulacion.nivel_estudios && NIVEL_ESTUDIOS_LABELS[postulacion.nivel_estudios],
    postulacion.grado_academico && GRADO_ACADEMICO_LABELS[postulacion.grado_academico],
    postulacion.experiencia_anios !== null && `${postulacion.experiencia_anios} años de experiencia`,
  ].filter(Boolean) as string[]

  return (
    <li className="space-y-3 py-5 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{postulacion.postulante_nombre || 'Candidato'}</p>
            <Badge variant={ESTADO_POSTULACION_VARIANT[postulacion.estado]}>
              {ESTADO_POSTULACION_LABELS[postulacion.estado]}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Se postuló {formatFechaRelativa(postulacion.created_at)}
          </p>
        </div>
        <Button variant="secondary" onClick={openCv} loading={opening}>
          Ver CV
        </Button>
      </div>

      <MatchIndicator match={match} />

      {(datos.length > 0 || postulacion.habilidades.length > 0) && (
        <div className="flex flex-wrap gap-1.5">
          {datos.map((d) => (
            <Badge key={d}>{d}</Badge>
          ))}
          {postulacion.habilidades.map((h) => (
            <Badge key={h} variant="brand">
              {h}
            </Badge>
          ))}
        </div>
      )}

      <EstadoPostulacionSelect postulacion={postulacion} onChanged={onChanged} />

      {postulacion.mensaje && (
        <p className="text-sm whitespace-pre-line text-slate-600 dark:text-slate-300">{postulacion.mensaje}</p>
      )}
      {error && <Alert variant="error">{error}</Alert>}
    </li>
  )
}
