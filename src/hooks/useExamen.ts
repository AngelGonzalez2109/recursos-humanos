import { useCallback, useEffect, useState } from 'react'
import { getPostulacionPropia, listExamenesCompletados, listResultadosVacante } from '../lib/examenService'
import type { RespuestasExamen } from '../types/examen'
import { useAsyncResource } from './useAsyncResource'

const fetchCompletados = () => listExamenesCompletados()

/** Ids de postulaciones con evaluación enviada (key estable por usuario) */
export function useExamenesCompletados(userId: string | null) {
  return useAsyncResource(userId, fetchCompletados)
}

export function usePostulacionPropia(id: string | null) {
  return useAsyncResource(id, getPostulacionPropia)
}

/** Resultados psicométricos de una vacante, para el reclutador */
export function useResultadosVacante(vacanteId: string | null) {
  return useAsyncResource(vacanteId, listResultadosVacante)
}

interface Progreso {
  answers: RespuestasExamen
  index: number
  /** Preguntas de memoria: id → marca de tiempo (ms) en que se mostró la secuencia */
  memoria: Record<string, number>
}

const EMPTY: Progreso = { answers: {}, index: 0, memoria: {} }

function read(key: string): Progreso {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return EMPTY
    const data = JSON.parse(raw) as Partial<Progreso>
    return {
      answers: data.answers && typeof data.answers === 'object' ? data.answers : {},
      index: typeof data.index === 'number' ? data.index : 0,
      memoria: data.memoria && typeof data.memoria === 'object' ? data.memoria : {},
    }
  } catch {
    return EMPTY
  }
}

/**
 * Progreso del examen guardado en localStorage (respuestas, pregunta actual y
 * secuencias de memoria ya mostradas) para sobrevivir a una recarga. La hora de
 * inicio no se guarda aquí: la fija el servidor. Si el almacenamiento no está
 * disponible, sigue funcionando en memoria.
 */
export function useExamenProgreso(key: string) {
  const [progreso, setProgreso] = useState<Progreso>(() => read(key))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(progreso))
    } catch {
      // sin almacenamiento: el progreso solo vive en memoria
    }
  }, [key, progreso])

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // nada que limpiar
    }
  }, [key])

  return { progreso, setProgreso, clear }
}

/** Milisegundos restantes hasta startedAt + duración; se actualiza cada medio segundo */
export function useCuentaRegresiva(startedAt: number, duracionMs: number): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(id)
  }, [])

  return Math.min(duracionMs, Math.max(0, startedAt + duracionMs - now))
}
