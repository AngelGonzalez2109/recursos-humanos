import areasData from '../../examen_areas.json'
import type { AreaExamen, CatalogoAreas, NivelExamen } from '../types/examen'

/** Catálogo de áreas (pequeño: no incluye las preguntas, que viven en examen_psicometrico.json) */
export const CATALOGO = areasData as unknown as CatalogoAreas
export const AREAS = CATALOGO.areas
export const PREGUNTAS_POR_AREA = CATALOGO.preguntas_por_area
export const MINUTOS_POR_AREA = CATALOGO.minutos_por_area

export const areaPorId = (id: string): AreaExamen | undefined => AREAS.find((a) => a.id === id)

/** Áreas del catálogo en su orden canónico, sin repetidos ni ids desconocidos */
export const ordenarAreas = (ids: string[]): string[] => AREAS.map((a) => a.id).filter((id) => ids.includes(id))

export const totalPreguntas = (nAreas: number) => nAreas * PREGUNTAS_POR_AREA
export const totalMinutos = (nAreas: number) => nAreas * MINUTOS_POR_AREA

/** Nivel (Bajo / Medio / Alto) que corresponde a un porcentaje */
export function nivelDe(porcentaje: number): NivelExamen {
  const niveles = [...CATALOGO.niveles].sort((a, b) => b.desde - a.desde)
  return niveles.find((n) => porcentaje >= n.desde) ?? niveles[niveles.length - 1]
}
