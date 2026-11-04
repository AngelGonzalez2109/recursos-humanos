import type { ReactNode } from 'react'

type BadgeVariant = 'neutral' | 'brand' | 'success' | 'muted' | 'warning' | 'danger'

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-100',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  muted: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  danger: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
}

export function Badge({ variant = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${VARIANT_STYLES[variant]}`}
    >
      {children}
    </span>
  )
}
