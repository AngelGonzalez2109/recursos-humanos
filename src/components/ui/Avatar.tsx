/** Iniciales del nombre (máx. 2 letras) */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const letters = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0]
  return letters.toUpperCase()
}

interface AvatarProps {
  name: string
  /** square: logotipo de empresa; round: persona */
  shape?: 'round' | 'square'
  size?: 'sm' | 'md'
}

export function Avatar({ name, shape = 'round', size = 'md' }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center bg-linear-to-br from-brand-500/20 to-brand-300/10 font-semibold text-brand-700 ring-1 ring-brand-500/25 ring-inset dark:text-brand-300 ${
        shape === 'round' ? 'rounded-full' : 'rounded-lg'
      } ${size === 'md' ? 'h-10 w-10 text-sm' : 'h-8 w-8 text-xs'}`}
    >
      {initials(name)}
    </span>
  )
}
