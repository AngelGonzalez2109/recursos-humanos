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
            `rounded-full px-4 py-1.5 text-sm font-medium transition-[background-color,color,transform] duration-200 active:scale-95 ${
              isActive
                ? 'bg-bone text-bistre ring-1 ring-bistre/15 ring-inset dark:bg-white/10 dark:text-cream dark:ring-white/15'
                : 'text-slate-700 hover:bg-bistre/[0.06] hover:text-bistre dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-cream'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
