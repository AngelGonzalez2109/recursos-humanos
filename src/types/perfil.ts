export type NivelEstudios = 'secundaria' | 'preparatoria' | 'universidad' | 'posgrado'
export type GradoAcademico = 'tecnico' | 'licenciado' | 'ingeniero' | 'maestro' | 'doctor'

/**
 * Datos comparables entre una vacante (requisitos) y un candidato (perfil).
 * Se guardan con los mismos nombres de columna en `vacantes` y `postulaciones`.
 */
export interface DatosPerfil {
  nivel_estudios: NivelEstudios | null
  grado_academico: GradoAcademico | null
  experiencia_anios: number | null
  habilidades: string[]
}

/** Valores de formulario compartidos (todo como texto; '' = sin valor) */
export interface PerfilFormValues {
  nivelEstudios: NivelEstudios | ''
  gradoAcademico: GradoAcademico | ''
  experienciaAnios: string
  habilidades: string[]
}
