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
            className={`h-8 w-8 cursor-pointer rounded-lg text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed ${
              isCurrent
                ? 'bg-brand-600 text-white shadow-md ring-2 ring-brand-500/40'
                : answered
                  ? 'bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-100'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            {index + 1}
          </button>
        )
      })}
    </nav>
  )
}
