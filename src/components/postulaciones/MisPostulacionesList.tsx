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

const LIST_CLASS = 'surface list-hairline overflow-hidden'

function Row({ postulacion, examenCompletado }: { postulacion: MiPostulacion; examenCompletado: boolean }) {
  const vacante = postulacion.vacantes
  const pideExamen = postulacion.estado === 'pruebas_psicometricas'
  return (
    <li className="flex flex-col gap-3 p-6 transition-colors hover:bg-bone/70 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-white/[0.03]">
      <div className="min-w-0">
        {vacante ? (
          <Link
            to={`/vacantes/${vacante.id}`}
            className="font-serif text-2xl leading-tight underline-offset-4 transition-colors hover:underline"
          >
            {vacante.titulo}
          </Link>
        ) : (
          <p className="font-serif text-2xl leading-tight">Vacante no disponible</p>
        )}
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
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
            className="rounded-full bg-bistre px-4 py-2 text-xs font-medium text-cream transition-colors hover:bg-ash dark:bg-cream dark:text-bistre dark:hover:bg-bone"
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
          <li key={i} className="animate-pulse space-y-2 p-6">
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
          <Link to="/vacantes" className="text-sm font-medium text-slate-900 underline underline-offset-4 dark:text-slate-100">
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
