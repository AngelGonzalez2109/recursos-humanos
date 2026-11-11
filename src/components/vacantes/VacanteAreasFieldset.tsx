import {
  AREAS,
  MINUTOS_POR_AREA,
  PREGUNTAS_POR_AREA,
  totalMinutos,
  totalPreguntas,
} from '../../lib/examenAreas'

interface VacanteAreasFieldsetProps {
  value: string[]
  onChange: (areas: string[]) => void
}

/** Bloque "Áreas a evaluar": el reclutador elige qué áreas incluye el examen psicométrico de esta vacante */
export function VacanteAreasFieldset({ value, onChange }: VacanteAreasFieldsetProps) {
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((a) => a !== id) : [...value, id])

  return (
    <fieldset className="space-y-4 rounded-sm border border-dashed border-bistre/25 p-4 dark:border-white/20">
      <legend className="px-2 font-display text-lg text-slate-900 dark:text-slate-100">
        Áreas a evaluar (examen psicométrico)
      </legend>
      <p className="text-xs text-slate-600 dark:text-slate-400">
        Elige las áreas que se evaluarán a los candidatos que avances a pruebas psicométricas. De cada área se
        eligen {PREGUNTAS_POR_AREA} preguntas al azar y el tiempo es de {MINUTOS_POR_AREA} minutos por área. Necesitas
        al menos una para poder avanzar candidatos a esa etapa.
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {AREAS.map((area) => {
          const checked = value.includes(area.id)
          return (
            <label
              key={area.id}
              className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3 text-sm transition-[background-color,border-color] duration-200 ${
                checked
                  ? 'border-bistre bg-white ring-1 ring-bistre dark:border-cream dark:bg-white/10 dark:ring-cream'
                  : 'border-slate-400 bg-white hover:border-bistre dark:border-slate-600 dark:bg-slate-900 dark:hover:border-cream'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(area.id)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-bistre dark:accent-cream"
              />
              <span className="min-w-0">
                <span className="block font-medium text-slate-900 dark:text-slate-100">{area.nombre}</span>
                <span className="eyebrow mt-1 block">{area.tipo}</span>
                <span className="mt-1 block text-xs text-slate-600 dark:text-slate-400">{area.descripcion}</span>
                {area.aviso && (
                  <span className="mt-1 block text-xs text-amber-600 dark:text-amber-400">{area.aviso}</span>
                )}
              </span>
            </label>
          )
        })}
      </div>

      <p className="text-sm text-slate-800 dark:text-slate-200" aria-live="polite">
        {value.length === 0
          ? 'Sin áreas: no podrás avanzar candidatos a pruebas psicométricas.'
          : `${value.length} ${value.length === 1 ? 'área' : 'áreas'} · ${totalPreguntas(value.length)} preguntas · ${totalMinutos(value.length)} minutos`}
      </p>
    </fieldset>
  )
}
