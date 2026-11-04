import { useMemo, useState } from 'react'
import { usePostulaciones } from '../../hooks/usePostulaciones'
import { ordenarPorMatch, type PostulacionConMatch } from '../../lib/match'
import { GRADO_ACADEMICO_LABELS, NIVEL_ESTUDIOS_LABELS } from '../../lib/perfilOptions'
import { getCvUrl } from '../../lib/postulacionesService'
import { formatFechaRelativa } from '../../lib/vacanteFormat'
import type { Vacante } from '../../types/vacante'
import { Alert } from '../ui/Alert'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { LoadError } from '../vacantes/LoadError'
import { MatchIndicator } from './MatchIndicator'

function PostulacionRow({ item: { postulacion, match } }: { item: PostulacionConMatch }) {
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
          <p className="font-medium">{postulacion.postulante_nombre || 'Candidato'}</p>
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

      {postulacion.mensaje && (
        <p className="text-sm whitespace-pre-line text-slate-600 dark:text-slate-300">{postulacion.mensaje}</p>
      )}
      {error && <Alert variant="error">{error}</Alert>}
    </li>
  )
}

/** Candidatos de una vacante, de mayor a menor compatibilidad (solo su publicador) */
export function PostulacionesRecibidas({ vacante }: { vacante: Vacante }) {
  const { data, loading, error, reload } = usePostulaciones(vacante.id)
  const ordenadas = useMemo(() => (data ? ordenarPorMatch(vacante, data) : []), [vacante, data])

  let content
  if (loading) content = <div className="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
  else if (error) content = <LoadError message={error} onRetry={reload} />
  else if (ordenadas.length === 0) {
    content = <p className="text-sm text-slate-500 dark:text-slate-400">Aún no hay postulaciones.</p>
  } else {
    content = (
      <ul className="divide-y divide-slate-200 dark:divide-slate-800">
        {ordenadas.map((item) => (
          <PostulacionRow key={item.postulacion.id} item={item} />
        ))}
      </ul>
    )
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-semibold">
        Postulaciones recibidas{data ? ` (${data.length})` : ''}
      </h2>
      <p className="mt-1 mb-4 text-xs text-slate-500 dark:text-slate-400">Ordenadas de mayor a menor compatibilidad.</p>
      {content}
    </section>
  )
}
