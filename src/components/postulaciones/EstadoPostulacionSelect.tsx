import { useState } from 'react'
import { getDbErrorMessage } from '../../lib/dbErrors'
import {
  ESTADO_POSTULACION_LABELS,
  ESTADOS_ASIGNABLES,
  isEstadoAsignable,
} from '../../lib/postulacionEstados'
import { updateEstadoPostulacion } from '../../lib/postulacionesService'
import type { EstadoPostulacion, Postulacion } from '../../types/postulacion'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { Select } from '../ui/Select'

const OPTIONS = [
  { value: '', label: 'Selecciona…' },
  ...ESTADOS_ASIGNABLES.map((value) => ({ value, label: ESTADO_POSTULACION_LABELS[value] })),
]

interface EstadoPostulacionSelectProps {
  postulacion: Postulacion
  onChanged: () => void
}

/**
 * "Cambiar estado": el valor mostrado sigue siendo el actual hasta que el
 * reclutador confirma en el diálogo; cancelar no cambia nada.
 */
export function EstadoPostulacionSelect({ postulacion, onChanged }: EstadoPostulacionSelectProps) {
  const [pending, setPending] = useState<EstadoPostulacion | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSelect(value: string) {
    if (isEstadoAsignable(value) && value !== postulacion.estado) {
      setError(null)
      setPending(value)
    }
  }

  function cancel() {
    if (saving) return
    setPending(null)
    setError(null)
  }

  async function confirm() {
    if (!pending) return
    setSaving(true)
    setError(null)
    try {
      await updateEstadoPostulacion(postulacion.id, pending)
      setPending(null)
      onChanged()
    } catch (err) {
      console.error('Error al cambiar el estado de la postulación:', err)
      setError(getDbErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Select
        label="Cambiar estado"
        className="w-full sm:w-72"
        options={OPTIONS}
        value={isEstadoAsignable(postulacion.estado) ? postulacion.estado : ''}
        onChange={(event) => handleSelect(event.target.value)}
      />
      <ConfirmDialog
        open={pending !== null}
        title="Confirmar cambio de estado"
        confirmLabel="Sí, cambiar estado"
        loading={saving}
        error={error}
        onConfirm={confirm}
        onCancel={cancel}
      >
        ¿Seguro que quieres establecer este estado como «{pending ? ESTADO_POSTULACION_LABELS[pending] : ''}»?
      </ConfirmDialog>
    </>
  )
}
