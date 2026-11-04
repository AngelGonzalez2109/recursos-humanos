import type { Vacante } from '../../types/vacante'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { LoadError } from './LoadError'
import { MisVacanteRow } from './MisVacanteRow'

interface MisVacantesListProps {
  vacantes: Vacante[]
  loading: boolean
  error: string | null
  onRetry: () => void
  onChanged: () => void
  onCreate: () => void
}

const LIST_CLASS =
  'divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900'

export function MisVacantesList({ vacantes, loading, error, onRetry, onChanged, onCreate }: MisVacantesListProps) {
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
  if (vacantes.length === 0) {
    return (
      <EmptyState
        title="Aún no has publicado vacantes"
        description="Publica tu primera oferta y empieza a recibir candidatos."
        action={<Button onClick={onCreate}>Publicar vacante</Button>}
      />
    )
  }

  const abiertas = vacantes.filter((v) => v.estado === 'abierta').length
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {vacantes.length} {vacantes.length === 1 ? 'vacante' : 'vacantes'} · {abiertas}{' '}
        {abiertas === 1 ? 'abierta' : 'abiertas'}
      </p>
      <ul className={LIST_CLASS}>
        {vacantes.map((vacante) => (
          <MisVacanteRow key={vacante.id} vacante={vacante} onChanged={onChanged} />
        ))}
      </ul>
    </div>
  )
}
