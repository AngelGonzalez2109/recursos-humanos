import type { ButtonHTMLAttributes } from 'react'
import { Spinner } from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  fullWidth?: boolean
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white shadow-[inset_0_1px_0_0_rgb(255_255_255/0.2),0_8px_20px_-10px_rgb(5_117_184/0.9)] hover:bg-brand-500 active:bg-brand-700 focus-visible:outline-brand-500 dark:bg-brand-400 dark:text-slate-950 dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.35),0_8px_24px_-8px_rgb(45_180_251/0.6)] dark:hover:bg-brand-300 dark:active:bg-brand-400',
  secondary:
    'border border-slate-300 bg-white text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:active:bg-slate-800/70',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus-visible:outline-brand-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:active:bg-slate-700',
  danger:
    'border border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50 active:bg-red-100 focus-visible:outline-red-500 dark:border-red-900/60 dark:bg-transparent dark:text-red-400 dark:hover:border-red-800 dark:hover:bg-red-950/40 dark:active:bg-red-950/60',
}

export function Button({
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 ${VARIANT_STYLES[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}
