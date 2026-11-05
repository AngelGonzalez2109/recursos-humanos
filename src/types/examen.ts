/** Respuestas: id de pregunta → letra de la opción (lógica) o valor 1-5 (Likert) */
export type RespuestasExamen = Record<string, string | number>

export interface OpcionExamen {
  id: string
  texto: string
}

export interface PreguntaLogica {
  id: string
  dimension: string
  tipo: 'opcion_multiple'
  enunciado: string
  opciones: OpcionExamen[]
}

export interface PreguntaLikert {
  id: string
  dimension: string
  tipo: 'likert'
  enunciado: string
}

export type PreguntaExamen = PreguntaLogica | PreguntaLikert

export interface NivelExamen {
  id: 'bajo' | 'medio' | 'alto'
  etiqueta: string
  /** Porcentaje mínimo para alcanzar el nivel */
  desde: number
}

export interface DimensionExamen {
  id: string
  nombre: string
  nombre_corto: string
  tipo: 'logica' | 'likert'
  presentacion: 'porcentaje' | 'nivel'
  niveles?: NivelExamen[]
}

export interface SeccionExamen {
  id: 'logica' | 'personalidad'
  titulo: string
  indicaciones: string
}

/** Contenido de examen_psicometrico.json (sin respuestas correctas ni clave de puntuación) */
export interface Examen {
  version: number
  titulo: string
  introduccion: string
  mensaje_final: string
  escala_likert: { valor: number; etiqueta: string }[]
  dimensiones: DimensionExamen[]
  secciones: SeccionExamen[]
  preguntas: PreguntaExamen[]
}

/** Fila de public.resultados_psicometricos (solo la lee el reclutador) */
export interface ResultadoPsicometrico {
  id: string
  postulacion_id: string
  version: number
  /** Porcentaje 0-100 por dimensión; null si no hubo respuestas en ella */
  puntajes: Record<string, number | null>
  respondidas: number
  por_tiempo: boolean
  created_at: string
}
