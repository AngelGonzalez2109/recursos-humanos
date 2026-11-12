import type { NivelExamen } from '../types/examen'

export type NivelId = NivelExamen['id']

/** Texto de cada nivel (oliva / ocre / arcilla); siempre acompaña a la etiqueta escrita */
export const NIVEL_TEXT: Record<NivelId, string> = {
  alto: 'text-emerald-600 dark:text-emerald-400',
  medio: 'text-amber-600 dark:text-amber-400',
  bajo: 'text-red-600 dark:text-red-400',
}

/** Relleno de medidores y barras */
export const NIVEL_FILL: Record<NivelId, string> = {
  alto: 'bg-emerald-600 dark:bg-emerald-400',
  medio: 'bg-amber-500 dark:bg-amber-400',
  bajo: 'bg-red-500 dark:bg-red-400',
}

/** Relleno de los puntos SVG del radar */
export const NIVEL_SVG_FILL: Record<NivelId, string> = {
  alto: 'fill-emerald-600 dark:fill-emerald-400',
  medio: 'fill-amber-500 dark:fill-amber-400',
  bajo: 'fill-red-500 dark:fill-red-400',
}

/** Puntaje de un área (o dimensión v1) listo para pintar */
export interface PuntajeArea {
  id: string
  nombre: string
  /** Porcentaje 0-100, o null si no hay dato */
  valor: number | null
  detalle?: string
}
