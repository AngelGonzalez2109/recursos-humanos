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

/** Etiquetas sugeridas (habilidades e idiomas); el usuario también puede escribir las suyas */
export const HABILIDADES_SUGERIDAS = [
  'Inglés',
  'Francés',
  'Excel',
  'Comunicación',
  'Trabajo en equipo',
  'Liderazgo',
  'Atención al cliente',
  'Ventas',
  'Contabilidad',
  'Reclutamiento',
  'SQL',
  'JavaScript',
  'Python',
  'Gestión de proyectos',
]

export const HABILIDADES_MAX = 20
export const HABILIDAD_MIN_LEN = 2
export const HABILIDAD_MAX_LEN = 40
export const EDAD_MIN = 16
export const EDAD_MAX = 99
export const EXPERIENCIA_MAX = 60

export function toOptions(labels: Record<string, string>, emptyLabel?: string) {
  const options = Object.entries(labels).map(([value, label]) => ({ value, label }))
  return emptyLabel ? [{ value: '', label: emptyLabel }, ...options] : options
}
