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
  /** La vacante no tiene áreas de evaluación: "pruebas psicométricas" no se puede asignar */
  sinAreas?: boolean
  onChanged: () => void
}

const AVISO_SIN_AREAS =
  'Esta vacante no tiene áreas a evaluar. Edítala y elige al menos una para avanzar candidatos a pruebas psicométricas.'

/**
 * "Cambiar estado": el valor mostrado sigue siendo el actual hasta que el
 * reclutador confirma en el diálogo; cancelar no cambia nada.
 */
export function EstadoPostulacionSelect({ postulacion, sinAreas, onChanged }: EstadoPostulacionSelectProps) {
  const [pending, setPending] = useState<EstadoPostulacion | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  function handleSelect(value: string) {
    setAviso(null)
    if (isEstadoAsignable(value) && value !== postulacion.estado) {
      if (value === 'pruebas_psicometricas' && sinAreas) {
        setAviso(AVISO_SIN_AREAS)
        return
      }
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
      {aviso && (
        <p role="alert" className="mt-2 text-xs text-amber-600 dark:text-amber-400">
          {aviso}
        </p>
      )}
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
