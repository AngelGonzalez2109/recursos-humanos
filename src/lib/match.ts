import { normalize } from './vacanteFormat'
import type { Postulacion } from '../types/postulacion'
import type { GradoAcademico, NivelEstudios } from '../types/perfil'
import type { Vacante } from '../types/vacante'

/**
 * Match automático candidato ↔ vacante.
 * Solo cuentan los criterios que la vacante define; el porcentaje es el
 * promedio ponderado de la compatibilidad de cada criterio activo.
 */
export const PESOS = { edad: 15, nivel: 20, grado: 20, experiencia: 20, habilidades: 25 } as const

export const NIVEL_RANK: Record<NivelEstudios, number> = {
  secundaria: 1,
  preparatoria: 2,
  universidad: 3,
  posgrado: 4,
}

/** Ingeniero y licenciado se consideran equivalentes */
export const GRADO_RANK: Record<GradoAcademico, number> = {
  tecnico: 1,
  licenciado: 2,
  ingeniero: 2,
  maestro: 3,
  doctor: 4,
}

export interface CriterioResultado {
  id: keyof typeof PESOS
  label: string
  /** Compatibilidad del criterio, de 0 a 1 */
  score: number
}

export interface MatchResultado {
  /** 0–100, o null si la vacante no define requisitos estructurados */
  porcentaje: number | null
  criterios: CriterioResultado[]
}

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)

function scoreHabilidades(required: string[], actual: string[]): number {
  const have = new Set(actual.map(normalize))
  return required.filter((tag) => have.has(normalize(tag))).length / required.length
}

export function calcularMatch(vacante: Vacante, candidato: Postulacion): MatchResultado {
  const criterios: CriterioResultado[] = []

  if (vacante.edad_min !== null || vacante.edad_max !== null) {
    const { edad } = candidato
    const dentro =
      edad !== null &&
      (vacante.edad_min === null || edad >= vacante.edad_min) &&
      (vacante.edad_max === null || edad <= vacante.edad_max)
    criterios.push({ id: 'edad', label: 'Edad', score: dentro ? 1 : 0 })
  }

  if (vacante.nivel_estudios) {
    const actual = candidato.nivel_estudios ? NIVEL_RANK[candidato.nivel_estudios] : 0
    criterios.push({
      id: 'nivel',
      label: 'Nivel de estudios',
      score: clamp01(actual / NIVEL_RANK[vacante.nivel_estudios]),
    })
  }

  if (vacante.grado_academico) {
    const actual = candidato.grado_academico ? GRADO_RANK[candidato.grado_academico] : 0
    criterios.push({
      id: 'grado',
      label: 'Grado académico',
      score: clamp01(actual / GRADO_RANK[vacante.grado_academico]),
    })
  }

  if (vacante.experiencia_anios !== null) {
    const required = vacante.experiencia_anios
    const score = required === 0 ? 1 : clamp01((candidato.experiencia_anios ?? 0) / required)
    criterios.push({ id: 'experiencia', label: 'Experiencia', score })
  }

  if (vacante.habilidades.length > 0) {
    criterios.push({
      id: 'habilidades',
      label: 'Habilidades',
      score: scoreHabilidades(vacante.habilidades, candidato.habilidades),
    })
  }

  if (criterios.length === 0) return { porcentaje: null, criterios }

  const total = criterios.reduce((sum, c) => sum + PESOS[c.id], 0)
  const obtenido = criterios.reduce((sum, c) => sum + PESOS[c.id] * c.score, 0)
  return { porcentaje: Math.round((obtenido / total) * 100), criterios }
}

export interface PostulacionConMatch {
  postulacion: Postulacion
  match: MatchResultado
}

/**
 * Orden estricto de mayor a menor compatibilidad. Empates (y vacantes sin
 * requisitos estructurados): primero la postulación más antigua.
 */
export function ordenarPorMatch(vacante: Vacante, postulaciones: Postulacion[]): PostulacionConMatch[] {
  return postulaciones
    .map((postulacion) => ({ postulacion, match: calcularMatch(vacante, postulacion) }))
    .sort(
      (a, b) =>
        (b.match.porcentaje ?? -1) - (a.match.porcentaje ?? -1) ||
        a.postulacion.created_at.localeCompare(b.postulacion.created_at),
    )
}
