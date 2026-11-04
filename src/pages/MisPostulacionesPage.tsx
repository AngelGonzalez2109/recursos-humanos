import { AppLayout } from '../components/layout/AppLayout'
import { MisPostulacionesList } from '../components/postulaciones/MisPostulacionesList'
import { useAuth } from '../hooks/useAuth'
import { useMisPostulaciones } from '../hooks/usePostulaciones'

/** Postulaciones del candidato y su estado */
export function MisPostulacionesPage() {
  const { profile } = useAuth()
  const { data, loading, error, reload } = useMisPostulaciones(profile?.id ?? null)

  return (
    <AppLayout title="Mis postulaciones" description="Consulta el estado de las vacantes a las que aplicaste.">
      <MisPostulacionesList postulaciones={data ?? []} loading={loading} error={error} onRetry={reload} />
    </AppLayout>
  )
}
