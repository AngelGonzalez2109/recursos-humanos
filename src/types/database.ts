export type UserRole = 'publicador' | 'postulante'

/** Fila de la tabla public.profiles */
export interface Profile {
  id: string
  role: UserRole
  full_name: string
  company_name: string | null
  created_at: string
  updated_at: string
}
