import type { DatosPerfil, PerfilFormValues } from './perfil'

export type Modalidad = 'presencial' | 'remoto' | 'hibrido'
export type TipoContrato = 'tiempo_completo' | 'medio_tiempo' | 'temporal' | 'practicas'
export type EstadoVacante = 'abierta' | 'cerrada'
export type Moneda = 'MXN' | 'USD' | 'EUR'

/** Fila de la tabla public.vacantes */
export interface Vacante extends DatosPerfil {
  id: string
  publicador_id: string
  titulo: string
  empresa: string
  ubicacion: string
  modalidad: Modalidad
  tipo_contrato: TipoContrato
  descripcion: string
  requisitos: string
  salario_min: number | null
  salario_max: number | null
  moneda: Moneda
  edad_min: number | null
  edad_max: number | null
  estado: EstadoVacante
  /** Áreas del examen psicométrico que se evalúan a los candidatos (ids de examen_areas.json) */
  areas_evaluacion: string[]
  created_at: string
  updated_at: string
}

/** Valores del formulario de publicación (todo como texto) */
export interface VacanteFormValues extends PerfilFormValues {
  titulo: string
  empresa: string
  ubicacion: string
  modalidad: Modalidad
  tipoContrato: TipoContrato
  descripcion: string
  requisitos: string
  salarioMin: string
  salarioMax: string
  moneda: Moneda
  edadMin: string
  edadMax: string
  areasEvaluacion: string[]
}

export type VacanteFieldErrors = Partial<Record<keyof VacanteFormValues, string>>
