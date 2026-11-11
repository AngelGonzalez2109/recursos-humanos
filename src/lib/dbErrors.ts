const DB_ERROR_MESSAGES: Record<string, string> = {
  '42501': 'No tienes permiso para realizar esta acción.',
  '23514': 'Algún dato no cumple las reglas del formulario. Revisa los campos.',
  '23505': 'Este registro ya existe.',
  '22023': 'La solicitud no es válida. Recarga la página e inténtalo de nuevo.',
  '22P02': 'Algún dato tiene un formato inválido.',
}

/** Traduce errores de PostgREST/PostgreSQL a mensajes en español */
export function getDbErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = String((error as { code: unknown }).code)
    if (DB_ERROR_MESSAGES[code]) return DB_ERROR_MESSAGES[code]
  }
  if (error instanceof TypeError) {
    return 'No se pudo conectar con el servidor. Revisa tu conexión.'
  }
  return 'Ocurrió un error inesperado. Inténtalo de nuevo.'
}
