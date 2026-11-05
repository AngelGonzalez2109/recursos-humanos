import type { ReactNode } from 'react'

type AlertVariant = 'error' | 'success' | 'info'

const VARIANT_STYLES: Record<AlertVariant, string> = {
  error:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-400/25 dark:bg-red-400/10 dark:text-red-300',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300',
  info: 'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-400/25 dark:bg-brand-400/10 dark:text-brand-200',
}

interface AlertProps {
  variant?: AlertVariant
  children: ReactNode
}

export function Alert({ variant = 'info', children }: AlertProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`animate-fade-in rounded-lg border px-4 py-3 text-sm ${VARIANT_STYLES[variant]}`}
    >
      {children}
    </div>
  )
}
