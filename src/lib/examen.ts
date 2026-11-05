import examenData from '../../examen_psicometrico.json'
import type { DimensionExamen, Examen, NivelExamen, PreguntaExamen, SeccionExamen } from '../types/examen'

export const EXAMEN = examenData as unknown as Examen
export const TOTAL_PREGUNTAS = EXAMEN.preguntas.length

/** Duración total de la prueba: 15 minutos */
export const DURACION_MS = 15 * 60 * 1000

export const examenStorageKey = (userId: string, postulacionId: string) =>
  `examen:${userId}:${postulacionId}:v${EXAMEN.version}`

export function seccionDe(pregunta: PreguntaExamen): SeccionExamen {
  const id = pregunta.tipo === 'opcion_multiple' ? 'logica' : 'personalidad'
  return EXAMEN.secciones.find((s) => s.id === id) as SeccionExamen
}

/** Nivel (Bajo / Medio / Alto) que corresponde a un porcentaje en una dimensión */
export function nivelDe(dimension: DimensionExamen, porcentaje: number): NivelExamen | null {
  const niveles = [...(dimension.niveles ?? [])].sort((a, b) => b.desde - a.desde)
  return niveles.find((n) => porcentaje >= n.desde) ?? null
}

export function formatMmSs(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const mm = String(Math.floor(total / 60)).padStart(2, '0')
  const ss = String(total % 60).padStart(2, '0')
  return `${mm}:${ss}`
}
