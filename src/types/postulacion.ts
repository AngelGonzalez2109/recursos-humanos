import type { DatosPerfil, PerfilFormValues } from './perfil'
import type { Vacante } from './vacante'

export type EstadoPostulacion = 'recibida' | 'en_revision' | 'rechazada' | 'pruebas_psicometricas'

/** Fila de la tabla public.postulaciones */
export interface Postulacion extends DatosPerfil {
  id: string
  vacante_id: string
  postulante_id: string
  postulante_nombre: string
  cv_path: string
  mensaje: string | null
  edad: number | null
  estado: EstadoPostulacion
  created_at: string
  updated_at: string
}

/** Valores del formulario de postulación */
export interface PostulacionFormValues extends PerfilFormValues {
  edad: string
  mensaje: string
}

/** Postulación del candidato junto con datos de la vacante (puede ser null si dejó de ser visible) */
export interface MiPostulacion extends Postulacion {
  vacantes: Pick<Vacante, 'id' | 'titulo' | 'empresa' | 'ubicacion' | 'estado' | 'areas_evaluacion'> | null
}
