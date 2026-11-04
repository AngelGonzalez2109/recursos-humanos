import { AppLayout } from '../components/layout/AppLayout'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'

/** Panel del publicador (reclutador) */
export function DashboardPage() {
  return (
    <AppLayout title="Panel de vacantes" description="Gestiona las ofertas de trabajo que publicas.">
      <EmptyState
        title="Aún no has publicado vacantes"
        description="Aquí aparecerán tus ofertas de trabajo y las postulaciones que recibas."
        action={<Button disabled>Publicar vacante (próximamente)</Button>}
      />
    </AppLayout>
  )
}
