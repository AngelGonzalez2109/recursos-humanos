import { supabase } from './supabaseClient'
import type { Postulacion } from '../types/postulacion'

const CV_BUCKET = 'cvs'
export const CV_MAX_BYTES = 5 * 1024 * 1024
export const MENSAJE_MAX = 1000

/** Devuelve un mensaje de error si el archivo no es un PDF válido */
export function validateCv(file: File | null): string | undefined {
  if (!file) return 'Adjunta tu CV en formato PDF.'
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  if (!isPdf) return 'El CV debe ser un archivo PDF.'
  if (file.size === 0) return 'El archivo está vacío.'
  if (file.size > CV_MAX_BYTES) return 'El CV no debe superar los 5 MB.'
  return undefined
}

/** Postulación del usuario actual a una vacante (null si aún no se postula) */
export async function getMiPostulacion(vacanteId: string): Promise<Postulacion | null> {
  const { data, error } = await supabase
    .from('postulaciones')
    .select('*')
    .eq('vacante_id', vacanteId)
    .maybeSingle<Postulacion>()
  if (error) throw error
  return data
}

/** Postulaciones recibidas en una vacante (RLS limita a su publicador) */
export async function listPostulaciones(vacanteId: string): Promise<Postulacion[]> {
  const { data, error } = await supabase
    .from('postulaciones')
    .select('*')
    .eq('vacante_id', vacanteId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Postulacion[]
}

/**
 * Sube el CV a Storage y registra la postulación. Si el registro falla,
 * elimina el archivo para no dejar CVs huérfanos.
 */
export async function postular(
  vacanteId: string,
  userId: string,
  file: File,
  mensaje: string,
): Promise<Postulacion> {
  const cvPath = `${userId}/${crypto.randomUUID()}.pdf`

  const { error: uploadError } = await supabase.storage
    .from(CV_BUCKET)
    .upload(cvPath, file, { contentType: 'application/pdf', upsert: false })
  if (uploadError) throw uploadError

  const { data, error } = await supabase
    .from('postulaciones')
    .insert({ vacante_id: vacanteId, cv_path: cvPath, mensaje: mensaje.trim() || null })
    .select('*')
    .single<Postulacion>()

  if (error) {
    await supabase.storage.from(CV_BUCKET).remove([cvPath])
    throw error
  }
  return data
}

/** URL temporal (60 s) para abrir el CV */
export async function getCvUrl(cvPath: string): Promise<string> {
  const { data, error } = await supabase.storage.from(CV_BUCKET).createSignedUrl(cvPath, 60)
  if (error) throw error
  return data.signedUrl
}
