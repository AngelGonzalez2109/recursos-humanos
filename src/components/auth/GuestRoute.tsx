import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { homeForRole } from '../../lib/roles'
import { FullPageLoader } from '../ui/FullPageLoader'
import { ProfileErrorScreen } from './ProfileErrorScreen'

function getRedirectFrom(state: unknown): string | null {
  if (state && typeof state === 'object' && 'from' in state) {
    const from = (state as { from: unknown }).from
    if (typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')) return from
  }
  return null
}

/** Rutas solo para visitantes (login, registro). Si ya hay sesión, redirige. */
export function GuestRoute() {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullPageLoader />
  if (session && profile) {
    return <Navigate to={getRedirectFrom(location.state) ?? homeForRole(profile.role)} replace />
  }
  if (session) return <ProfileErrorScreen />
  return <Outlet />
}
