import type { Session } from '@supabase/supabase-js'
import type { Profile, UserRole } from './database'

export interface SignUpData {
  email: string
  password: string
  role: UserRole
  fullName: string
  companyName?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface RegisterFormValues {
  fullName: string
  companyName: string
  email: string
  password: string
  confirmPassword: string
}

export type RegisterFieldErrors = Partial<Record<keyof RegisterFormValues, string>>

export interface AuthContextValue {
  session: Session | null
  profile: Profile | null
  /** true mientras se resuelve la sesión inicial o se carga el perfil */
  loading: boolean
  profileError: string | null
  signOut: () => Promise<void>
}
