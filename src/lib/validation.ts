import type { UserRole } from '../types/database'
import type { RegisterFieldErrors, RegisterFormValues } from '../types/auth'

export const MIN_PASSWORD_LENGTH = 8

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function validateRegister(
  values: RegisterFormValues,
  role: UserRole,
): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {}
  const fullName = values.fullName.trim()
  const companyName = values.companyName.trim()

  if (fullName.length < 2) errors.fullName = 'Ingresa tu nombre completo.'
  else if (fullName.length > 120) errors.fullName = 'Máximo 120 caracteres.'

  if (role === 'publicador') {
    if (companyName.length === 0) errors.companyName = 'Ingresa el nombre de tu empresa.'
    else if (companyName.length > 120) errors.companyName = 'Máximo 120 caracteres.'
  }

  if (!isValidEmail(values.email)) errors.email = 'Ingresa un correo válido.'

  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Usa al menos ${MIN_PASSWORD_LENGTH} caracteres.`
  }
  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden.'
  }

  return errors
}
