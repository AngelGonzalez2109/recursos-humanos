import type { Vacante } from '../../types/vacante'
import { EmptyState } from '../ui/EmptyState'
import { LoadError } from './LoadError'
import { VacanteCard, VacanteCardSkeleton } from './VacanteCard'

interface VacantesFeedProps {
  vacantes: Vacante[]
  loading: boolean
  error: string | null
  onRetry: () => void
  hasQuery: boolean
}

const GRID = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'

export function VacantesFeed({ vacantes, loading, error, onRetry, hasQuery }: VacantesFeedProps) {
  if (loading) {
    return (
      <div className={GRID} aria-busy="true">
        {Array.from({ length: 6 }, (_, i) => (
          <VacanteCardSkeleton key={i} />
        ))}
      </div>
    )
  }
  if (error) return <LoadError message={error} onRetry={onRetry} />
  if (vacantes.length === 0) {
    return hasQuery ? (
      <EmptyState title="Sin resultados" description="Prueba con otro puesto, empresa o ciudad." />
    ) : (
      <EmptyState
        title="Todavía no hay vacantes publicadas"
        description="Cuando los reclutadores publiquen ofertas, las verás aquí."
      />
    )
  }
  return (
    <div className={GRID}>
      {vacantes.map((vacante) => (
        <VacanteCard key={vacante.id} vacante={vacante} />
      ))}
    </div>
  )
}
