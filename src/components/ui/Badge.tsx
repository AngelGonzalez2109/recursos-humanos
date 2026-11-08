import type { ReactNode } from 'react'

type BadgeVariant = 'neutral' | 'brand' | 'success' | 'muted' | 'warning' | 'danger'

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-bistre/15 dark:bg-white/[0.06] dark:text-slate-300 dark:ring-white/15',
  // Único acento cromático: un toque chartreuse
  brand: 'bg-chartreuse/70 text-bistre ring-bistre/15 dark:bg-chartreuse/15 dark:text-chartreuse dark:ring-chartreuse/30',
  success:
    'bg-emerald-100/70 text-emerald-700 ring-emerald-600/25 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/25',
  muted: 'bg-transparent text-slate-600 ring-bistre/15 dark:text-slate-400 dark:ring-white/10',
  warning:
    'bg-amber-100/70 text-amber-700 ring-amber-600/25 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/25',
  danger: 'bg-red-100/70 text-red-700 ring-red-600/25 dark:bg-red-400/10 dark:text-red-300 dark:ring-red-400/25',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
}

export function Badge({ variant = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${VARIANT_STYLES[variant]}`}
    >
      {children}
    </span>
  )
}
