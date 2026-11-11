/** Respuestas: id de pregunta → letra de la opción (a-d) o valor 1-5 (escala de acuerdo) */
export type RespuestasExamen = Record<string, string | number>

export interface OpcionExamen {
  id: string
  texto: string
}

export interface PreguntaOpciones {
  id: string
  area: string
  tipo: 'opcion_multiple'
  enunciado: string
  opciones: OpcionExamen[]
  /** Secuencia que se muestra unos segundos y luego se oculta (tareas de memoria) */
  memorizar?: string
}

export interface PreguntaLikert {
  id: string
  area: string
  tipo: 'likert'
  enunciado: string
}

export type PreguntaExamen = PreguntaOpciones | PreguntaLikert

/** Contenido de examen_psicometrico.json (sin respuestas correctas ni clave de puntuación) */
export interface Examen {
  version: number
  introduccion: string
  mensaje_final: string
  segundos_memorizar: number
  escala_likert: { valor: number; etiqueta: string }[]
  preguntas: PreguntaExamen[]
}

export interface NivelExamen {
  id: 'bajo' | 'medio' | 'alto'
  etiqueta: string
  /** Porcentaje mínimo para alcanzar el nivel */
  desde: number
}

export interface AreaExamen {
  id: string
  /** Prefijo de los ids de sus preguntas (p. ej. LOG → LOG-01) */
  prefijo: string
  nombre: string
  nombre_corto: string
  tipo: string
  descripcion: string
  indicaciones: string
  aviso?: string
}

/** Contenido de examen_areas.json: catálogo de áreas que el reclutador puede elegir */
export interface CatalogoAreas {
  version: number
  titulo: string
  niveles: NivelExamen[]
  preguntas_por_area: number
  minutos_por_area: number
  areas: AreaExamen[]
}

/** Respuesta de examen_psicometrico_sesion(): examen asignado y hora de inicio (del servidor) */
export interface SesionExamen {
  areas: string[]
  preguntas: string[]
  iniciado_en: string
  duracion_seg: number
  ahora: string
}

/** Examen en curso, listo para mostrar: reloj ajustado al del navegador */
export interface SesionActiva {
  areas: string[]
  preguntas: PreguntaExamen[]
  /** Marca de tiempo (ms, reloj del navegador) en que comenzó */
  startedAt: number
  duracionMs: number
}

export type Dispositivo = 'movil' | 'tablet' | 'escritorio'

/** Fila de public.resultados_psicometricos (solo la lee el reclutador) */
export interface ResultadoPsicometrico {
  id: string
  postulacion_id: string
  /** 1 = examen global anterior; 2 = examen por áreas */
  version: number
  /** Porcentaje 0-100 por área (v2) o dimensión (v1); null si no hubo respuestas */
  puntajes: Record<string, number | null>
  respuestas: RespuestasExamen
  respondidas: number
  por_tiempo: boolean
  areas: string[] | null
  total_preguntas: number | null
  dispositivo: Dispositivo | null
  created_at: string
}
