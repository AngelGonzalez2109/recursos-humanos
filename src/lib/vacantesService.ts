import { supabase } from './supabaseClient'
import { ordenarAreas } from './examenAreas'
import { parseEntero, parseSalario } from './vacanteValidation'
import type { EstadoVacante, Vacante, VacanteFormValues } from '../types/vacante'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Feed del postulante: vacantes abiertas, más recientes primero */
export async function listVacantesAbiertas(): Promise<Vacante[]> {
  const { data, error } = await supabase
    .from('vacantes')
    .select('*')
    .eq('estado', 'abierta')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Vacante[]
}

/** Vacantes del publicador (abiertas y cerradas) */
export async function listMisVacantes(publicadorId: string): Promise<Vacante[]> {
  const { data, error } = await supabase
    .from('vacantes')
    .select('*')
    .eq('publicador_id', publicadorId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Vacante[]
}

/** Devuelve null si no existe o no es visible para el usuario (RLS) */
export async function getVacante(id: string): Promise<Vacante | null> {
  if (!UUID_RE.test(id)) return null
  const { data, error } = await supabase.from('vacantes').select('*').eq('id', id).maybeSingle<Vacante>()
  if (error) throw error
  return data
}

/** Columnas editables de la vacante a partir de los valores del formulario */
function toRow(values: VacanteFormValues) {
  return {
    titulo: values.titulo.trim(),
    empresa: values.empresa.trim(),
    ubicacion: values.ubicacion.trim(),
    modalidad: values.modalidad,
    tipo_contrato: values.tipoContrato,
    descripcion: values.descripcion.trim(),
    requisitos: values.requisitos.trim(),
    salario_min: parseSalario(values.salarioMin),
    salario_max: parseSalario(values.salarioMax),
    moneda: values.moneda,
    edad_min: parseEntero(values.edadMin),
    edad_max: parseEntero(values.edadMax),
    nivel_estudios: values.nivelEstudios || null,
    grado_academico: values.gradoAcademico || null,
    experiencia_anios: parseEntero(values.experienciaAnios),
    habilidades: values.habilidades,
    areas_evaluacion: ordenarAreas(values.areasEvaluacion),
  }
}

/** publicador_id lo asigna la base de datos (default auth.uid()) */
export async function createVacante(values: VacanteFormValues): Promise<Vacante> {
  const { data, error } = await supabase.from('vacantes').insert(toRow(values)).select('*').single<Vacante>()
  if (error) throw error
  return data
}

/** Edita una vacante propia (RLS: solo su publicador; falla si no se actualizó ninguna fila) */
export async function updateVacante(id: string, values: VacanteFormValues): Promise<Vacante> {
  const { data, error } = await supabase
    .from('vacantes')
    .update(toRow(values))
    .eq('id', id)
    .select('*')
    .single<Vacante>()
  if (error) throw error
  return data
}

export async function updateEstadoVacante(id: string, estado: EstadoVacante): Promise<void> {
  const { error } = await supabase.from('vacantes').update({ estado }).eq('id', id)
  if (error) throw error
}
