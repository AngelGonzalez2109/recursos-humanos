import { useState, type ChangeEvent, type FormEvent } from 'react'
import { signUp } from '../../lib/authService'
import { getAuthErrorMessage } from '../../lib/authErrors'
import { MIN_PASSWORD_LENGTH, validateRegister } from '../../lib/validation'
import type { UserRole } from '../../types/database'
import type { RegisterFieldErrors, RegisterFormValues } from '../../types/auth'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { RoleSelector } from './RoleSelector'

const INITIAL_VALUES: RegisterFormValues = {
  fullName: '',
  companyName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

interface RegisterFormProps {
  /** Se llama tras un registro exitoso que requiere confirmar el correo */
  onNeedsConfirmation: (email: string) => void
}

export function RegisterForm({ onNeedsConfirmation }: RegisterFormProps) {
  const [role, setRole] = useState<UserRole>('postulante')
  const [values, setValues] = useState<RegisterFormValues>(INITIAL_VALUES)
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field: keyof RegisterFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const errors = validateRegister(values, role)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      const email = values.email.trim()
      const { needsConfirmation } = await signUp({
        email,
        password: values.password,
        role,
        fullName: values.fullName,
        companyName: values.companyName,
      })
      // Si no requiere confirmación, la sesión se abre sola y GuestRoute redirige
      if (needsConfirmation) onNeedsConfirmation(email)
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {submitError && <Alert variant="error">{submitError}</Alert>}

      <RoleSelector value={role} onChange={setRole} />

      <Input
        label="Nombre completo"
        autoComplete="name"
        value={values.fullName}
        onChange={handleChange('fullName')}
        error={fieldErrors.fullName}
      />

      {role === 'publicador' && (
        <Input
          label="Empresa"
          autoComplete="organization"
          className="animate-fade-in"
          value={values.companyName}
          onChange={handleChange('companyName')}
          error={fieldErrors.companyName}
        />
      )}

      <Input
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={handleChange('email')}
        error={fieldErrors.email}
      />

      <Input
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        hint={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres.`}
        value={values.password}
        onChange={handleChange('password')}
        error={fieldErrors.password}
      />

      <Input
        label="Confirmar contraseña"
        type="password"
        autoComplete="new-password"
        value={values.confirmPassword}
        onChange={handleChange('confirmPassword')}
        error={fieldErrors.confirmPassword}
      />

      <Button type="submit" fullWidth loading={submitting}>
        Crear cuenta
      </Button>
    </form>
  )
}
