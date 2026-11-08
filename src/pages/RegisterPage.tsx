import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { RegisterForm } from '../components/auth/RegisterForm'
import { Alert } from '../components/ui/Alert'

const LINK_STYLES =
  'font-medium text-slate-900 underline decoration-bistre/30 underline-offset-4 transition-colors hover:decoration-bistre dark:text-slate-100 dark:decoration-white/30 dark:hover:decoration-white'

export function RegisterPage() {
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  if (pendingEmail) {
    return (
      <AuthLayout title="Revisa tu correo" subtitle="Solo falta un paso para activar tu cuenta.">
        <div className="space-y-6">
          <Alert variant="success">
            Enviamos un enlace de confirmación a <strong>{pendingEmail}</strong>. Ábrelo para
            activar tu cuenta.
          </Alert>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            ¿Ya confirmaste?{' '}
            <Link to="/login" className={LINK_STYLES}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Elige cómo quieres usar la plataforma."
      footer={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className={LINK_STYLES}>
            Inicia sesión
          </Link>
        </>
      }
    >
      <RegisterForm onNeedsConfirmation={setPendingEmail} />
    </AuthLayout>
  )
}
