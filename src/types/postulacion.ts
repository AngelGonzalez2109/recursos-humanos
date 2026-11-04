import type { DatosPerfil, PerfilFormValues } from './perfil'

/** Fila de la tabla public.postulaciones */
export interface Postulacion extends DatosPerfil {
  id: string
  vacante_id: string
  postulante_id: string
  postulante_nombre: string
  cv_path: string
  mensaje: string | null
  edad: number | null
  created_at: string
}

/** Valores del formulario de postulación */
export interface PostulacionFormValues extends PerfilFormValues {
  edad: string
  mensaje: string
}
