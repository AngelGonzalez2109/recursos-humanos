import { AppLayout } from '../components/layout/AppLayout'
import { MisPostulacionesList } from '../components/postulaciones/MisPostulacionesList'
import { useAuth } from '../hooks/useAuth'
import { useExamenesCompletados } from '../hooks/useExamen'
import { useMisPostulaciones } from '../hooks/usePostulaciones'

/** Postulaciones del candidato y su estado */
export function MisPostulacionesPage() {
  const { profile } = useAuth()
  const { data, loading, error, reload } = useMisPostulaciones(profile?.id ?? null)
  const completados = useExamenesCompletados(profile?.id ?? null)

  return (
    <AppLayout title="Mis postulaciones" description="Consulta el estado de las vacantes a las que aplicaste.">
      <MisPostulacionesList
        postulaciones={data ?? []}
        examenesCompletados={completados.data ?? []}
        loading={loading || completados.loading}
        error={error}
        onRetry={reload}
      />
    </AppLayout>
  )
}
