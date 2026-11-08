import type { ReactNode } from 'react'

type AlertVariant = 'error' | 'success' | 'info'

const VARIANT_STYLES: Record<AlertVariant, string> = {
  error:
    'border-red-600/40 bg-red-50 text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300',
  success:
    'border-emerald-600/40 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300',
  info: 'border-bistre/25 bg-slate-100 text-slate-700 dark:border-white/20 dark:bg-white/[0.06] dark:text-slate-200',
}

interface AlertProps {
  variant?: AlertVariant
  children: ReactNode
}

export function Alert({ variant = 'info', children }: AlertProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`animate-fade-in rounded-sm border border-dashed px-4 py-3 text-sm ${VARIANT_STYLES[variant]}`}
    >
      {children}
    </div>
  )
}
