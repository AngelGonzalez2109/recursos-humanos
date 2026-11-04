import type { VacanteFieldErrors, VacanteFormValues } from '../types/vacante'

/** Convierte "25,000" o "25000.50" a número; vacío → null; inválido → NaN */
export function parseSalario(value: string): number | null {
  const clean = value.replace(/[\s,$]/g, '')
  if (clean === '') return null
  return /^\d+(\.\d{1,2})?$/.test(clean) ? Number(clean) : Number.NaN
}

function checkLength(value: string, min: number, max: number, label: string): string | undefined {
  const length = value.trim().length
  if (length < min) return min <= 1 ? `${label} es obligatorio.` : `${label}: mínimo ${min} caracteres.`
  if (length > max) return `${label}: máximo ${max} caracteres.`
  return undefined
}

/** Mismos límites que los CHECK de supabase/03_vacantes.sql */
export function validateVacante(values: VacanteFormValues): VacanteFieldErrors {
  const errors: VacanteFieldErrors = {
    titulo: checkLength(values.titulo, 3, 120, 'El título'),
    empresa: checkLength(values.empresa, 2, 120, 'La empresa'),
    ubicacion: checkLength(values.ubicacion, 2, 120, 'La ubicación'),
    descripcion: checkLength(values.descripcion, 20, 5000, 'La descripción'),
    requisitos: checkLength(values.requisitos, 10, 5000, 'Los requisitos'),
  }

  const min = parseSalario(values.salarioMin)
  const max = parseSalario(values.salarioMax)
  if (Number.isNaN(min)) errors.salarioMin = 'Ingresa un monto válido.'
  if (Number.isNaN(max)) errors.salarioMax = 'Ingresa un monto válido.'
  if (min !== null && max !== null && !Number.isNaN(min) && !Number.isNaN(max) && max < min) {
    errors.salarioMax = 'Debe ser mayor o igual al mínimo.'
  }

  // Quita las claves sin error
  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message !== undefined),
  ) as VacanteFieldErrors
}
