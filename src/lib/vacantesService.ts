import { supabase } from './supabaseClient'
import { parseSalario } from './vacanteValidation'
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

/** publicador_id lo asigna la base de datos (default auth.uid()) */
export async function createVacante(values: VacanteFormValues): Promise<Vacante> {
  const { data, error } = await supabase
    .from('vacantes')
    .insert({
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
    })
    .select('*')
    .single<Vacante>()
  if (error) throw error
  return data
}

export async function updateEstadoVacante(id: string, estado: EstadoVacante): Promise<void> {
  const { error } = await supabase.from('vacantes').update({ estado }).eq('id', id)
  if (error) throw error
}
