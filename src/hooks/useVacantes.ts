import { getVacante, listMisVacantes, listVacantesAbiertas } from '../lib/vacantesService'
import { useAsyncResource } from './useAsyncResource'

const FEED_KEY = 'abiertas'
const fetchFeed = () => listVacantesAbiertas()

/** Vacantes abiertas para el feed del postulante */
export function useVacantesAbiertas() {
  return useAsyncResource(FEED_KEY, fetchFeed)
}

/** Vacantes del publicador autenticado */
export function useMisVacantes(publicadorId: string | null) {
  return useAsyncResource(publicadorId, listMisVacantes)
}

/** Detalle de una vacante; data === null sin error significa "no encontrada" */
export function useVacante(id: string | null) {
  return useAsyncResource(id, getVacante)
}
