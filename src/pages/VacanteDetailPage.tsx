import { Link, useParams } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadError } from '../components/vacantes/LoadError'
import { VacanteDetail } from '../components/vacantes/VacanteDetail'
import { useAuth } from '../hooks/useAuth'
import { useVacante } from '../hooks/useVacantes'
import { homeForRole } from '../lib/roles'

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true">
      <div className="h-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
      <div className="h-48 rounded-xl bg-slate-100 dark:bg-slate-900" />
    </div>
  )
}

export function VacanteDetailPage() {
  const { id } = useParams()
  const { profile } = useAuth()
  const { data: vacante, loading, error, reload } = useVacante(id ?? null)

  // ProtectedRoute garantiza que hay perfil
  if (!profile) return null
  const backTo = homeForRole(profile.role)

  let content
  if (loading) content = <DetailSkeleton />
  else if (error) content = <LoadError message={error} onRetry={reload} />
  else if (!vacante) {
    content = (
      <EmptyState
        title="Vacante no encontrada"
        description="Es posible que haya sido eliminada o que el enlace sea incorrecto."
      />
    )
  } else {
    content = (
      <VacanteDetail
        vacante={vacante}
        viewerRole={profile.role}
        isOwner={vacante.publicador_id === profile.id}
      />
    )
  }

  return (
    <AppLayout>
      <Link
        to={backTo}
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <span aria-hidden="true">←</span>
        {profile.role === 'publicador' ? 'Volver al panel' : 'Volver a vacantes'}
      </Link>
      {content}
    </AppLayout>
  )
}
