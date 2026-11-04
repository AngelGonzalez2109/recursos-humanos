import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabaseClient'
import { fetchProfile, signOut as signOutRequest } from '../../lib/authService'
import { AuthContext } from '../../hooks/authContext'
import type { Profile } from '../../types/database'
import type { AuthContextValue } from '../../types/auth'

interface ProfileState {
  userId: string
  profile: Profile | null
  error: string | null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [profileState, setProfileState] = useState<ProfileState | null>(null)

  // Escucha la sesión (incluye INITIAL_SESSION al montar)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setSessionLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Carga el perfil cada vez que cambia el usuario autenticado
  const userId = session?.user.id
  useEffect(() => {
    if (!userId) return
    let cancelled = false
    fetchProfile(userId)
      .then((profile) => {
        if (!cancelled) setProfileState({ userId, profile, error: null })
      })
      .catch((error: unknown) => {
        console.error('Error al cargar el perfil:', error)
        if (!cancelled) {
          setProfileState({ userId, profile: null, error: 'No se pudo cargar tu perfil.' })
        }
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  const signOut = useCallback(async () => {
    await signOutRequest()
  }, [])

  // Solo vale el perfil si corresponde al usuario de la sesión actual
  const current = userId && profileState?.userId === userId ? profileState : null

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile: current?.profile ?? null,
      loading: sessionLoading || (Boolean(userId) && current === null),
      profileError: current?.error ?? null,
      signOut,
    }),
    [session, current, sessionLoading, userId, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
