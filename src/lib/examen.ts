import examenData from '../../examen_psicometrico.json'
import type { Examen, PreguntaExamen, SesionActiva, SesionExamen } from '../types/examen'

export const EXAMEN = examenData as unknown as Examen

const PREGUNTAS_POR_ID = new Map(EXAMEN.preguntas.map((p) => [p.id, p]))

export const examenStorageKey = (userId: string, postulacionId: string) =>
  `examen:${userId}:${postulacionId}:v${EXAMEN.version}`

/**
 * Convierte la sesión del servidor en un examen listo para mostrar. Las horas
 * del servidor se pasan al reloj del navegador para que el temporizador no
 * dependa de que ambos relojes estén sincronizados.
 */
export function sesionActiva(sesion: SesionExamen): SesionActiva {
  const desfase = Date.parse(sesion.ahora) - Date.now()
  return {
    areas: sesion.areas,
    preguntas: sesion.preguntas
      .map((id) => PREGUNTAS_POR_ID.get(id))
      .filter((p): p is PreguntaExamen => p !== undefined),
    startedAt: Date.parse(sesion.iniciado_en) - desfase,
    duracionMs: sesion.duracion_seg * 1000,
  }
}

export function formatMmSs(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const mm = String(Math.floor(total / 60)).padStart(2, '0')
  const ss = String(total % 60).padStart(2, '0')
  return `${mm}:${ss}`
}
