import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { signIn } from '../lib/authService'
import { getAuthErrorMessage } from '../lib/authErrors'
import { isValidEmail } from '../lib/validation'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValidEmail(email) || password.length === 0) {
      setError('Ingresa tu correo y contraseña.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await signIn({ email: email.trim(), password })
      // Al abrirse la sesión, GuestRoute redirige según el rol
    } catch (err) {
      setError(getAuthErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Inicia sesión"
      subtitle="Accede a tu cuenta para continuar."
      footer={
        <>
          ¿No tienes cuenta?{' '}
          <Link
            to="/registro"
            className="font-medium text-slate-900 underline decoration-bistre/30 underline-offset-4 transition-colors hover:decoration-bistre dark:text-slate-100 dark:decoration-white/30 dark:hover:decoration-white"
          >
            Regístrate
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        <Input
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button type="submit" fullWidth loading={submitting}>
          Iniciar sesión
        </Button>
      </form>
    </AuthLayout>
  )
}
