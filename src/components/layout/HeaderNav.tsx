import { NavLink } from 'react-router-dom'
import type { UserRole } from '../../types/database'

const LINKS: Record<UserRole, { to: string; label: string; end?: boolean }[]> = {
  publicador: [{ to: '/dashboard', label: 'Mis vacantes' }],
  postulante: [
    { to: '/vacantes', label: 'Vacantes', end: true },
    { to: '/mis-postulaciones', label: 'Mis postulaciones' },
  ],
}

export function HeaderNav({ role }: { role: UserRole }) {
  return (
    <nav aria-label="Principal" className="flex items-center gap-1">
      {LINKS[role].map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
              isActive
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-100'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
