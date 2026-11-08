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
  onEdit: (vacante: Vacante) => void
}

const LIST_CLASS = 'surface list-hairline overflow-hidden'

export function MisVacantesList({ vacantes, loading, error, onRetry, onChanged, onCreate, onEdit }: MisVacantesListProps) {
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
      <p className="eyebrow">
        {vacantes.length} {vacantes.length === 1 ? 'vacante' : 'vacantes'} · {abiertas}{' '}
        {abiertas === 1 ? 'abierta' : 'abiertas'}
      </p>
      <ul className={LIST_CLASS}>
        {vacantes.map((vacante) => (
          <MisVacanteRow key={vacante.id} vacante={vacante} onChanged={onChanged} onEdit={onEdit} />
        ))}
      </ul>
    </div>
  )
}
