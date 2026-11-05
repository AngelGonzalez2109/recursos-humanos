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
            `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 active:scale-95 ${
              isActive
                ? 'bg-brand-500/10 text-brand-700 ring-1 ring-brand-500/20 ring-inset dark:bg-brand-400/10 dark:text-brand-300 dark:ring-brand-400/25'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
