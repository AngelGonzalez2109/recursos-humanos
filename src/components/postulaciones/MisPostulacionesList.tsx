import { Link } from 'react-router-dom'
import { ESTADO_POSTULACION_LABELS, ESTADO_POSTULACION_VARIANT } from '../../lib/postulacionEstados'
import { formatFechaRelativa } from '../../lib/vacanteFormat'
import type { MiPostulacion } from '../../types/postulacion'
import { Badge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'
import { LoadError } from '../vacantes/LoadError'

interface MisPostulacionesListProps {
  postulaciones: MiPostulacion[]
  /** Ids de postulaciones cuya evaluación psicométrica ya se envió */
  examenesCompletados: string[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

const LIST_CLASS =
  'divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900'

function Row({ postulacion, examenCompletado }: { postulacion: MiPostulacion; examenCompletado: boolean }) {
  const vacante = postulacion.vacantes
  const pideExamen = postulacion.estado === 'pruebas_psicometricas'
  return (
    <li className="flex flex-col gap-3 p-5 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-slate-800/50">
      <div className="min-w-0">
        {vacante ? (
          <Link
            to={`/vacantes/${vacante.id}`}
            className="font-semibold transition-colors hover:text-brand-600 dark:hover:text-brand-500"
          >
            {vacante.titulo}
          </Link>
        ) : (
          <p className="font-semibold">Vacante no disponible</p>
        )}
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          {vacante ? `${vacante.empresa} · ${vacante.ubicacion} · ` : ''}
          Te postulaste {formatFechaRelativa(postulacion.created_at)}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {vacante?.estado === 'cerrada' && <Badge variant="muted">Vacante cerrada</Badge>}
        <Badge variant={ESTADO_POSTULACION_VARIANT[postulacion.estado]}>
          {ESTADO_POSTULACION_LABELS[postulacion.estado]}
        </Badge>
        {pideExamen && examenCompletado && <Badge variant="success">Evaluación enviada</Badge>}
        {pideExamen && !examenCompletado && (
          <Link
            to={`/evaluacion/${postulacion.id}`}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            Realizar evaluación
          </Link>
        )}
      </div>
    </li>
  )
}

export function MisPostulacionesList({
  postulaciones,
  examenesCompletados,
  loading,
  error,
  onRetry,
}: MisPostulacionesListProps) {
  if (loading) {
    return (
      <ul className={LIST_CLASS} aria-busy="true">
        {Array.from({ length: 3 }, (_, i) => (
          <li key={i} className="animate-pulse space-y-2 p-5">
            <div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
          </li>
        ))}
      </ul>
    )
  }
  if (error) return <LoadError message={error} onRetry={onRetry} />
  if (postulaciones.length === 0) {
    return (
      <EmptyState
        title="Aún no te has postulado"
        description="Cuando te postules a una vacante, aquí podrás seguir el estado de tu solicitud."
        action={
          <Link to="/vacantes" className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-500">
            Ver vacantes disponibles
          </Link>
        }
      />
    )
  }
  return (
    <ul className={LIST_CLASS}>
      {postulaciones.map((p) => (
        <Row key={p.id} postulacion={p} examenCompletado={examenesCompletados.includes(p.id)} />
      ))}
    </ul>
  )
}
