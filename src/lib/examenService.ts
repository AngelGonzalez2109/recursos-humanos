import { supabase } from './supabaseClient'
import type { MiPostulacion } from '../types/postulacion'
import type { RespuestasExamen, ResultadoPsicometrico } from '../types/examen'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Envía las respuestas. El puntaje se calcula en la base de datos
 * (enviar_examen_psicometrico) y el candidato nunca lo recibe.
 */
export async function enviarExamen(
  postulacionId: string,
  respuestas: RespuestasExamen,
  porTiempo: boolean,
): Promise<void> {
  const { error } = await supabase.rpc('enviar_examen_psicometrico', {
    p_postulacion_id: postulacionId,
    p_respuestas: respuestas,
    p_por_tiempo: porTiempo,
  })
  if (error) throw error
}

/** Ids de las postulaciones del usuario cuya evaluación ya fue enviada */
export async function listExamenesCompletados(): Promise<string[]> {
  const { data, error } = await supabase.rpc('examenes_completados')
  if (error) throw error
  return (data ?? []) as string[]
}

/** Postulación propia (con datos de la vacante); null si no existe o no es suya */
export async function getPostulacionPropia(id: string): Promise<MiPostulacion | null> {
  if (!UUID_RE.test(id)) return null
  const { data, error } = await supabase
    .from('postulaciones')
    .select('*, vacantes(id, titulo, empresa, ubicacion, estado)')
    .eq('id', id)
    .maybeSingle<MiPostulacion>()
  if (error) throw error
  return data
}

/** Resultados de las postulaciones de una vacante (RLS: solo su publicador) */
export async function listResultadosVacante(vacanteId: string): Promise<ResultadoPsicometrico[]> {
  const { data, error } = await supabase
    .from('resultados_psicometricos')
    .select('*, postulaciones!inner(vacante_id)')
    .eq('postulaciones.vacante_id', vacanteId)
  if (error) throw error
  return (data ?? []) as ResultadoPsicometrico[]
}
