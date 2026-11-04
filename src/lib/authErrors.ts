import { isAuthError } from '@supabase/supabase-js'

const GENERIC_ERROR = 'Ocurrió un error inesperado. Inténtalo de nuevo.'
const RATE_LIMIT = 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.'

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Correo o contraseña incorrectos.',
  email_not_confirmed:
    'Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.',
  user_already_exists: 'Ya existe una cuenta con este correo.',
  email_exists: 'Ya existe una cuenta con este correo.',
  weak_password: 'La contraseña es demasiado débil. Usa al menos 8 caracteres.',
  email_address_invalid: 'El correo electrónico no es válido.',
  signup_disabled: 'El registro de nuevas cuentas está deshabilitado.',
  over_email_send_rate_limit: RATE_LIMIT,
  over_request_rate_limit: RATE_LIMIT,
}

/** Crea un error con un mensaje ya listo para mostrar al usuario */
export function appError(message: string): Error {
  const error = new Error(message)
  error.name = 'AppError'
  return error
}

/** Traduce cualquier error de autenticación a un mensaje en español */
export function getAuthErrorMessage(error: unknown): string {
  if (isAuthError(error)) {
    if (error.code && AUTH_ERROR_MESSAGES[error.code]) {
      return AUTH_ERROR_MESSAGES[error.code]
    }
    if (error.name === 'AuthRetryableFetchError') {
      return 'No se pudo conectar con el servidor. Revisa tu conexión.'
    }
    return GENERIC_ERROR
  }
  if (error instanceof Error && error.name === 'AppError') return error.message
  return GENERIC_ERROR
}
