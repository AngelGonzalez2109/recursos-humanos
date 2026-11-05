import { useCallback, useEffect, useState } from 'react'
import { DURACION_MS } from '../lib/examen'
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
  /** Marca de tiempo (ms) en que el candidato comenzó; null = aún en la pantalla de inicio */
  startedAt: number | null
  answers: RespuestasExamen
  index: number
}

const EMPTY: Progreso = { startedAt: null, answers: {}, index: 0 }

function read(key: string): Progreso {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return EMPTY
    const data = JSON.parse(raw) as Partial<Progreso>
    return {
      startedAt: typeof data.startedAt === 'number' ? data.startedAt : null,
      answers: data.answers && typeof data.answers === 'object' ? data.answers : {},
      index: typeof data.index === 'number' ? data.index : 0,
    }
  } catch {
    return EMPTY
  }
}

/**
 * Progreso del examen guardado en localStorage (respuestas, pregunta actual y
 * hora de inicio) para sobrevivir a una recarga. Si el almacenamiento no está
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
export function useCuentaRegresiva(startedAt: number | null): number | null {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (startedAt === null) return
    const id = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(id)
  }, [startedAt])

  return startedAt === null ? null : Math.min(DURACION_MS, Math.max(0, startedAt + DURACION_MS - now))
}
