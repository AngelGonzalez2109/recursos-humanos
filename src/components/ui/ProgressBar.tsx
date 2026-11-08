interface ProgressBarProps {
  /** 0–100 */
  value: number
  label: string
  /** Clases del relleno; por defecto tinta sólida */
  barClassName?: string
  heightClassName?: string
}

/** Barra de progreso cuyo relleno se anima al aparecer y al cambiar de valor */
export function ProgressBar({
  value,
  label,
  barClassName = 'bg-bistre dark:bg-cream',
  heightClassName = 'h-2',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`${heightClassName} overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800`}
    >
      <div
        className={`h-full animate-bar-fill rounded-full transition-[width] duration-700 ease-out ${barClassName}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
