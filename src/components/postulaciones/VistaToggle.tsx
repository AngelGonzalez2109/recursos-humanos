export type Vista = 'simple' | 'avanzada'

const OPCIONES: { id: Vista; label: string }[] = [
  { id: 'simple', label: 'Vista simple' },
  { id: 'avanzada', label: 'Vista avanzada' },
]

interface VistaToggleProps {
  vista: Vista
  onChange: (vista: Vista) => void
}

/** Selector de dos opciones (simple / avanzada) del resultado psicométrico de un candidato */
export function VistaToggle({ vista, onChange }: VistaToggleProps) {
  return (
    <div
      role="group"
      aria-label="Vista del resultado"
      className="inline-flex rounded-full p-0.5 ring-1 ring-bistre/25 ring-inset dark:ring-cream/20"
    >
      {OPCIONES.map((o) => {
        const activa = vista === o.id
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={activa}
            onClick={() => onChange(o.id)}
            className={`min-h-8 cursor-pointer rounded-full px-3 text-xs font-medium transition-[background-color,color,transform] duration-200 ease-(--ease-soft) select-none active:scale-[0.97] ${
              activa
                ? 'bg-chartreuse text-bistre'
                : 'text-slate-600 hover:bg-bistre/[0.06] hover:text-bistre dark:text-slate-300 dark:hover:bg-cream/10 dark:hover:text-cream'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
