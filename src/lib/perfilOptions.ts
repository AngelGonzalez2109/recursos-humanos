import catalogo from '../../etiquetas_habilidades.json'
import type { GradoAcademico, NivelEstudios } from '../types/perfil'

export const NIVEL_ESTUDIOS_LABELS: Record<NivelEstudios, string> = {
  secundaria: 'Secundaria',
  preparatoria: 'Preparatoria / Bachillerato',
  universidad: 'Universidad',
  posgrado: 'Posgrado',
}

export const GRADO_ACADEMICO_LABELS: Record<GradoAcademico, string> = {
  tecnico: 'Técnico',
  licenciado: 'Licenciado',
  ingeniero: 'Ingeniero',
  maestro: 'Maestro',
  doctor: 'Doctor',
}

/** Catálogo de habilidades e idiomas (etiquetas_habilidades.json, en la raíz del proyecto) */
export const HABILIDADES_CATALOGO: string[] = catalogo

export const HABILIDADES_MAX = 20
export const HABILIDAD_MIN_LEN = 1
export const HABILIDAD_MAX_LEN = 60
export const EDAD_MIN = 16
export const EDAD_MAX = 99
export const EXPERIENCIA_MAX = 60

export function toOptions(labels: Record<string, string>, emptyLabel?: string) {
  const options = Object.entries(labels).map(([value, label]) => ({ value, label }))
  return emptyLabel ? [{ value: '', label: emptyLabel }, ...options] : options
}
