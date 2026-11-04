import { AppLayout } from '../components/layout/AppLayout'
import { EmptyState } from '../components/ui/EmptyState'

/** Feed de vacantes del postulante (candidato) */
export function VacantesPage() {
  return (
    <AppLayout title="Vacantes disponibles" description="Encuentra tu próxima oportunidad laboral.">
      <EmptyState
        title="Todavía no hay vacantes publicadas"
        description="Cuando los reclutadores publiquen ofertas, las verás aquí."
      />
    </AppLayout>
  )
}
