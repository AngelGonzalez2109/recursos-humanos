import { supabase } from './supabaseClient'
import { appError } from './authErrors'
import type { Profile } from '../types/database'
import type { SignInData, SignUpData } from '../types/auth'

/**
 * Registra un usuario. El trigger handle_new_user crea su fila en
 * public.profiles a partir de los metadatos enviados aquí.
 */
export async function signUp({ email, password, role, fullName, companyName }: SignUpData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
      data: {
        role,
        full_name: fullName.trim(),
        company_name: role === 'publicador' ? companyName?.trim() || null : null,
      },
    },
  })
  if (error) throw error

  // Con confirmación por correo activa, Supabase no devuelve error si el
  // correo ya existe: devuelve un usuario sin identidades.
  if (data.user && data.user.identities?.length === 0) {
    throw appError('Ya existe una cuenta con este correo.')
  }

  return { needsConfirmation: data.session === null }
}

export async function signIn({ email, password }: SignInData) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function fetchProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, full_name, company_name, created_at, updated_at')
    .eq('id', userId)
    .single<Profile>()
  if (error) throw error
  return data
}
