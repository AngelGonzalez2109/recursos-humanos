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
    <div className="sticky top-16 z-10 flex items-center gap-5 rounded-xl border border-slate-200 bg-white/95 px-5 py-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <TimerRing remainingMs={remainingMs} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{EXAMEN.titulo}</p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
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
            className="h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
