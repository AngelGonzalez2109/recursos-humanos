import type { EstadoVacante, Modalidad, Moneda, TipoContrato, Vacante } from '../types/vacante'

export const MODALIDAD_LABELS: Record<Modalidad, string> = {
  presencial: 'Presencial',
  remoto: 'Remoto',
  hibrido: 'Híbrido',
}

export const TIPO_CONTRATO_LABELS: Record<TipoContrato, string> = {
  tiempo_completo: 'Tiempo completo',
  medio_tiempo: 'Medio tiempo',
  temporal: 'Temporal',
  practicas: 'Prácticas',
}

export const ESTADO_LABELS: Record<EstadoVacante, string> = {
  abierta: 'Abierta',
  cerrada: 'Cerrada',
}

export const MONEDAS: Moneda[] = ['MXN', 'USD', 'EUR']

function formatMonto(value: number, moneda: Moneda): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatSalario({ salario_min: min, salario_max: max, moneda }: Vacante): string {
  if (min === null && max === null) return 'Salario no especificado'
  if (min !== null && max !== null) {
    return min === max
      ? `${formatMonto(min, moneda)} al mes`
      : `${formatMonto(min, moneda)} – ${formatMonto(max, moneda)} al mes`
  }
  if (min !== null) return `Desde ${formatMonto(min, moneda)} al mes`
  return `Hasta ${formatMonto(max as number, moneda)} al mes`
}

const DAY_MS = 24 * 60 * 60 * 1000

/** "hoy", "ayer", "hace 5 días" o la fecha si pasó más de un mes */
export function formatFechaRelativa(iso: string): string {
  const date = new Date(iso)
  const days = Math.floor((Date.now() - date.getTime()) / DAY_MS)
  if (days > 30) {
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  return new Intl.RelativeTimeFormat('es', { numeric: 'auto' }).format(-Math.max(days, 0), 'day')
}

function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/** Búsqueda por título, empresa o ubicación (ignora mayúsculas y acentos) */
export function filterVacantes(vacantes: Vacante[], query: string): Vacante[] {
  const term = normalize(query.trim())
  if (!term) return vacantes
  return vacantes.filter((v) => normalize(`${v.titulo} ${v.empresa} ${v.ubicacion}`).includes(term))
}
