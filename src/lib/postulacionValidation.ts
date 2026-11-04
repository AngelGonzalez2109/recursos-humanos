import { EDAD_MAX, EDAD_MIN, EXPERIENCIA_MAX } from './perfilOptions'
import { checkEntero } from './vacanteValidation'
import type { PostulacionFormValues } from '../types/postulacion'

export type PostulacionFieldErrors = Partial<Record<keyof PostulacionFormValues, string>>

/** Edad, nivel de estudios y experiencia son obligatorios para poder calcular el match */
export function validatePerfilCandidato(values: PostulacionFormValues): PostulacionFieldErrors {
  const errors: PostulacionFieldErrors = {
    edad:
      values.edad.trim() === ''
        ? 'Indica tu edad.'
        : checkEntero(values.edad, EDAD_MIN, EDAD_MAX, 'La edad'),
    experienciaAnios:
      values.experienciaAnios.trim() === ''
        ? 'Indica tus años de experiencia (0 si no tienes).'
        : checkEntero(values.experienciaAnios, 0, EXPERIENCIA_MAX, 'La experiencia'),
    nivelEstudios: values.nivelEstudios ? undefined : 'Selecciona tu nivel de estudios.',
  }
  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message !== undefined),
  ) as PostulacionFieldErrors
}
