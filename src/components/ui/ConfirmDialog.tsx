import type { ReactNode } from 'react'
import { Alert } from './Alert'
import { Button } from './Button'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel?: string
  loading?: boolean
  error?: string | null
  onConfirm: () => void
  onCancel: () => void
}

/** Diálogo pequeño de confirmación: no ejecuta nada hasta que el usuario acepta */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = 'Confirmar',
  loading = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel} size="md">
      <div className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        <p className="text-sm">{children}</p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
