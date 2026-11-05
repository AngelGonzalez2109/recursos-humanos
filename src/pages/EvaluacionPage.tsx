import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { ExamenDone } from '../components/examen/ExamenDone'
import { ExamenRunner } from '../components/examen/ExamenRunner'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadError } from '../components/vacantes/LoadError'
import { useAuth } from '../hooks/useAuth'
import { useExamenesCompletados, usePostulacionPropia } from '../hooks/useExamen'

function Back() {
  return (
    <Link to="/mis-postulaciones" className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-500">
      Volver a mis postulaciones
    </Link>
  )
}

/** Evaluación de Perfil Profesional: solo con la postulación en "pruebas psicométricas" y un único intento */
export function EvaluacionPage() {
  const { postulacionId } = useParams()
  const { profile } = useAuth()
  const postulacion = usePostulacionPropia(postulacionId ?? null)
  const completados = useExamenesCompletados(profile?.id ?? null)
  const [sent, setSent] = useState(false)
  const handleDone = useCallback(() => setSent(true), [])

  if (!profile) return null

  let content
  if (postulacion.loading || completados.loading) {
    content = <div className="h-64 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" aria-busy="true" />
  } else if (postulacion.error || completados.error) {
    content = (
      <LoadError
        message={postulacion.error ?? completados.error ?? ''}
        onRetry={() => {
          postulacion.reload()
          completados.reload()
        }}
      />
    )
  } else if (!postulacion.data) {
    content = (
      <EmptyState title="Postulación no encontrada" description="Es posible que el enlace sea incorrecto." action={<Back />} />
    )
  } else if (sent || completados.data?.includes(postulacion.data.id)) {
    content = <ExamenDone />
  } else if (postulacion.data.estado !== 'pruebas_psicometricas') {
    content = (
      <EmptyState
        title="Evaluación no disponible"
        description="Esta evaluación se habilita cuando el reclutador avanza tu postulación a pruebas psicométricas."
        action={<Back />}
      />
    )
  } else {
    content = (
      <ExamenRunner
        postulacionId={postulacion.data.id}
        userId={profile.id}
        vacanteTitulo={postulacion.data.vacantes?.titulo ?? null}
        onDone={handleDone}
      />
    )
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl">{content}</div>
    </AppLayout>
  )
}
