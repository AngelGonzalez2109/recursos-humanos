import { useMemo, useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { Input } from '../components/ui/Input'
import { VacantesFeed } from '../components/vacantes/VacantesFeed'
import { useVacantesAbiertas } from '../hooks/useVacantes'
import { filterVacantes } from '../lib/vacanteFormat'

/** Feed de vacantes del postulante (candidato) */
export function VacantesPage() {
  const { data, loading, error, reload } = useVacantesAbiertas()
  const [query, setQuery] = useState('')
  const vacantes = useMemo(() => filterVacantes(data ?? [], query), [data, query])

  return (
    <AppLayout title="Vacantes disponibles" description="Encuentra tu próxima oportunidad laboral.">
      <div className="mb-6 max-w-md">
        <Input
          label="Buscar vacantes"
          type="search"
          placeholder="Puesto, empresa o ciudad"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <VacantesFeed
        vacantes={vacantes}
        loading={loading}
        error={error}
        onRetry={reload}
        hasQuery={query.trim() !== ''}
      />
    </AppLayout>
  )
}
