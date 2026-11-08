import type { ButtonHTMLAttributes } from 'react'
import { Spinner } from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  fullWidth?: boolean
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  // Píldora oscura: la única acción rellena de cada vista
  primary:
    'rounded-full bg-bistre px-6 text-cream hover:bg-ash active:bg-ash dark:bg-cream dark:text-bistre dark:hover:bg-bone dark:active:bg-bone',
  // Contorno rectangular: acompaña a la píldora sin competir con ella
  secondary:
    'rounded-none border border-bistre/90 px-5 text-bistre hover:bg-bistre/[0.06] active:bg-bistre/10 dark:border-cream/80 dark:text-cream dark:hover:bg-cream/10 dark:active:bg-cream/15',
  ghost:
    'rounded-full px-4 text-slate-600 hover:bg-bistre/[0.06] hover:text-bistre active:bg-bistre/10 dark:text-slate-300 dark:hover:bg-cream/10 dark:hover:text-cream dark:active:bg-cream/15',
  danger:
    'rounded-none border border-red-600/70 px-5 text-red-600 hover:bg-red-600/[0.08] active:bg-red-600/15 dark:border-red-400/60 dark:text-red-400 dark:hover:bg-red-400/10 dark:active:bg-red-400/15',
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
      className={`inline-flex cursor-pointer items-center justify-center gap-2 min-h-10 py-2.5 text-sm font-medium transition-[background-color,border-color,color,transform] duration-200 ease-(--ease-soft) select-none active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${VARIANT_STYLES[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}
