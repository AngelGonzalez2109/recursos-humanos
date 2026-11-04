import type { UserRole } from '../types/database'

export const ROLE_LABELS: Record<UserRole, string> = {
  publicador: 'Reclutador',
  postulante: 'Candidato',
}

/** Ruta de inicio según el rol del usuario */
export function homeForRole(role: UserRole): string {
  return role === 'publicador' ? '/dashboard' : '/vacantes'
}
