import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { homeForRole } from '../../lib/roles'
import type { UserRole } from '../../types/database'
import { FullPageLoader } from '../ui/FullPageLoader'
import { ProfileErrorScreen } from './ProfileErrorScreen'

interface ProtectedRouteProps {
  /** Si se indica, solo los usuarios con este rol pueden entrar */
  allowedRole?: UserRole
}

export function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullPageLoader />
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!profile) return <ProfileErrorScreen />
  if (allowedRole && profile.role !== allowedRole) {
    return <Navigate to={homeForRole(profile.role)} replace />
  }
  return <Outlet />
}
