import { getMiPostulacion, listPostulaciones } from '../lib/postulacionesService'
import { useAsyncResource } from './useAsyncResource'

/** Postulación del usuario actual a la vacante; data === null: aún no se postula */
export function useMiPostulacion(vacanteId: string | null) {
  return useAsyncResource(vacanteId, getMiPostulacion)
}

/** Postulaciones recibidas (solo el publicador de la vacante las ve) */
export function usePostulaciones(vacanteId: string | null) {
  return useAsyncResource(vacanteId, listPostulaciones)
}
