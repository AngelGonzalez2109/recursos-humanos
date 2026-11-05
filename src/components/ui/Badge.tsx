import type { ReactNode } from 'react'

type BadgeVariant = 'neutral' | 'brand' | 'success' | 'muted' | 'warning' | 'danger'

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800/70 dark:text-slate-300 dark:ring-white/10',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-400/10 dark:text-brand-300 dark:ring-brand-400/25',
  success:
    'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/25',
  muted: 'bg-slate-50 text-slate-500 ring-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:ring-white/5',
  warning:
    'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/25',
  danger: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-400/10 dark:text-red-300 dark:ring-red-400/25',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
}

export function Badge({ variant = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${VARIANT_STYLES[variant]}`}
    >
      {children}
    </span>
  )
}
