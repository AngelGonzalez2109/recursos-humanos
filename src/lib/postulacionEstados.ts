import type { EstadoPostulacion } from '../types/postulacion'

export const ESTADO_POSTULACION_LABELS: Record<EstadoPostulacion, string> = {
  recibida: 'Recibida',
  en_revision: 'En revisión',
  rechazada: 'Rechazada',
  pruebas_psicometricas: 'Avanzar a pruebas psicométricas',
}

/** Estados que el reclutador puede asignar ("recibida" solo es el estado inicial) */
export const ESTADOS_ASIGNABLES: EstadoPostulacion[] = ['en_revision', 'rechazada', 'pruebas_psicometricas']

export const ESTADO_POSTULACION_VARIANT = {
  recibida: 'neutral',
  en_revision: 'warning',
  rechazada: 'danger',
  pruebas_psicometricas: 'success',
} as const

export function isEstadoAsignable(value: string): value is EstadoPostulacion {
  return (ESTADOS_ASIGNABLES as string[]).includes(value)
}
