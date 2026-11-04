import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { AuthLayout } from './AuthLayout'

/** Se muestra si hay sesión pero no se pudo leer la fila de profiles */
export function ProfileErrorScreen() {
  const { profileError, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      setSigningOut(false)
    }
  }

  return (
    <AuthLayout
      title="No pudimos cargar tu cuenta"
      subtitle="Tu sesión está activa, pero no encontramos los datos de tu perfil."
    >
      <div className="space-y-4">
        <Alert variant="error">{profileError ?? 'Perfil no disponible.'}</Alert>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => window.location.reload()}>
            Reintentar
          </Button>
          <Button fullWidth loading={signingOut} onClick={handleSignOut}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </AuthLayout>
  )
}
