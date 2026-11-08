import { EXAMEN, TOTAL_PREGUNTAS } from '../../lib/examen'
import { TimerRing } from './TimerRing'

interface ExamenBarraProps {
  remainingMs: number
  answered: number
}

/** Cabecera fija del examen: temporizador circular y avance */
export function ExamenBarra({ remainingMs, answered }: ExamenBarraProps) {
  const percent = Math.round((answered / TOTAL_PREGUNTAS) * 100)

  return (
    <div className="sticky top-24 z-10 flex items-center gap-5 surface bg-slate-50/90 px-5 py-3 backdrop-blur-xl dark:bg-slate-900/85">
      <TimerRing remainingMs={remainingMs} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg leading-tight">{EXAMEN.titulo}</p>
        <p className="eyebrow mt-1">
          {answered} de {TOTAL_PREGUNTAS} respondidas
        </p>
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Avance de la evaluación"
          className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        >
          <div
            className="h-full rounded-full bg-bistre transition-[width] duration-500 dark:bg-cream"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
