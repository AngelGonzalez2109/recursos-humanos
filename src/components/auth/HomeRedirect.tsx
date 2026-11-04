import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { homeForRole } from '../../lib/roles'

/** Envía al usuario autenticado a la pantalla de inicio de su rol */
export function HomeRedirect() {
  const { profile } = useAuth()
  return <Navigate to={profile ? homeForRole(profile.role) : '/login'} replace />
}
