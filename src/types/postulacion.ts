/** Fila de la tabla public.postulaciones */
export interface Postulacion {
  id: string
  vacante_id: string
  postulante_id: string
  postulante_nombre: string
  cv_path: string
  mensaje: string | null
  created_at: string
}
