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
      className={`flex shrink-0 items-center justify-center bg-slate-200 font-serif text-slate-900 ring-1 ring-bistre/10 ring-inset dark:bg-white/10 dark:text-slate-100 dark:ring-white/15 ${
        shape === 'round' ? 'rounded-full' : 'rounded-sm'
      } ${size === 'md' ? 'h-11 w-11 text-xl' : 'h-9 w-9 text-lg'}`}
    >
      {initials(name)}
    </span>
  )
}
