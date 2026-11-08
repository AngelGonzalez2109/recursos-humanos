import { useCallback, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useMiPostulacion } from '../../hooks/usePostulaciones'
import { ESTADO_POSTULACION_LABELS } from '../../lib/postulacionEstados'
import { formatFechaRelativa } from '../../lib/vacanteFormat'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { LoadError } from '../vacantes/LoadError'
import { PostulacionForm } from './PostulacionForm'

/** Bloque "Postularme" del detalle de vacante (solo candidatos) */
export function PostularPanel({ vacanteId }: { vacanteId: string }) {
  const { profile } = useAuth()
  const { data: enviada, loading, error, reload } = useMiPostulacion(vacanteId)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  if (!profile) return null
  if (loading) return <div className="mt-6 h-10 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
  if (error) {
    return (
      <div className="mt-6">
        <LoadError message={error} onRetry={reload} />
      </div>
    )
  }

  if (enviada) {
    return (
      <div className="mt-6">
        <Alert variant="success">
          Ya te postulaste a esta vacante {formatFechaRelativa(enviada.created_at)}. Estado:{' '}
          <strong>{ESTADO_POSTULACION_LABELS[enviada.estado]}</strong>.
        </Alert>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <Button fullWidth onClick={() => setOpen(true)}>
        Postularme
      </Button>
      <Modal open={open} title="Postularme a la vacante" onClose={close}>
        <PostulacionForm
          vacanteId={vacanteId}
          userId={profile.id}
          onSent={() => {
            close()
            reload()
          }}
          onCancel={close}
        />
      </Modal>
    </div>
  )
}
