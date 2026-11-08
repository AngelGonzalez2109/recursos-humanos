import { EXAMEN } from '../../lib/examen'
import type { RespuestasExamen } from '../../types/examen'

interface PreguntaNavProps {
  answers: RespuestasExamen
  current: number
  disabled: boolean
  onGo: (index: number) => void
}

/** Mapa de preguntas: respondidas, pendientes y la actual */
export function PreguntaNav({ answers, current, disabled, onGo }: PreguntaNavProps) {
  return (
    <nav aria-label="Mapa de preguntas" className="flex flex-wrap gap-1.5">
      {EXAMEN.preguntas.map((pregunta, index) => {
        const answered = answers[pregunta.id] !== undefined
        const isCurrent = index === current
        return (
          <button
            key={pregunta.id}
            type="button"
            disabled={disabled}
            onClick={() => onGo(index)}
            aria-label={`Pregunta ${index + 1}${answered ? ', respondida' : ', sin responder'}`}
            aria-current={isCurrent ? 'step' : undefined}
            className={`h-8 w-8 cursor-pointer rounded-full font-mono text-xs tabular-nums transition-[background-color,color] duration-200 disabled:cursor-not-allowed ${
              isCurrent
                ? 'bg-bistre text-cream ring-2 ring-bistre/25 ring-offset-2 ring-offset-slate-50 dark:bg-cream dark:text-bistre dark:ring-cream/30 dark:ring-offset-slate-900'
                : answered
                  ? 'bg-chartreuse/70 text-bistre hover:bg-chartreuse dark:bg-chartreuse/15 dark:text-chartreuse dark:hover:bg-chartreuse/25'
                  : 'text-slate-600 ring-1 ring-bistre/20 ring-inset hover:bg-bistre/[0.06] dark:text-slate-400 dark:ring-white/20 dark:hover:bg-white/5'
            }`}
          >
            {index + 1}
          </button>
        )
      })}
    </nav>
  )
}
