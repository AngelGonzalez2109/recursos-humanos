import { EXAMEN, seccionDe } from '../../lib/examen'
import type { PreguntaExamen } from '../../types/examen'

interface PreguntaCardProps {
  pregunta: PreguntaExamen
  numero: number
  value: string | number | undefined
  disabled: boolean
  onAnswer: (value: string | number) => void
}

const BASE =
  'cursor-pointer rounded-sm border text-left text-sm transition-[background-color,border-color] duration-200 disabled:cursor-not-allowed disabled:opacity-60'
const IDLE =
  'border-slate-400 bg-white hover:border-bistre dark:border-slate-600 dark:bg-slate-900 dark:hover:border-cream'
const SELECTED =
  'animate-pop border-bistre bg-white ring-1 ring-bistre dark:border-cream dark:bg-white/10 dark:ring-cream'

/** Una pregunta: opción múltiple (A-D) o escala Likert (1-5) */
export function PreguntaCard({ pregunta, numero, value, disabled, onAnswer }: PreguntaCardProps) {
  const seccion = seccionDe(pregunta)

  return (
    <section key={pregunta.id} className="animate-fade-in space-y-6" aria-labelledby={`q-${pregunta.id}`}>
      <div>
        <p className="eyebrow text-slate-800 dark:text-slate-200">
          {seccion.titulo}
        </p>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{seccion.indicaciones}</p>
      </div>

      <h2 id={`q-${pregunta.id}`} className="text-2xl leading-snug sm:text-3xl">
        <span className="mr-2 text-slate-500 tabular-nums">{numero}.</span>
        {pregunta.enunciado}
      </h2>

      {pregunta.tipo === 'opcion_multiple' ? (
        <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-labelledby={`q-${pregunta.id}`}>
          {pregunta.opciones.map((opcion) => (
            <button
              key={opcion.id}
              type="button"
              role="radio"
              aria-checked={value === opcion.id}
              disabled={disabled}
              onClick={() => onAnswer(opcion.id)}
              className={`${BASE} flex items-center gap-3 px-4 py-4 ${value === opcion.id ? SELECTED : IDLE}`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm uppercase ${
                  value === opcion.id
                    ? 'bg-bistre text-cream dark:bg-cream dark:text-bistre'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {opcion.id}
              </span>
              <span className="font-medium">{opcion.texto}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-5" role="radiogroup" aria-labelledby={`q-${pregunta.id}`}>
          {EXAMEN.escala_likert.map((nivel) => (
            <button
              key={nivel.valor}
              type="button"
              role="radio"
              aria-checked={value === nivel.valor}
              disabled={disabled}
              onClick={() => onAnswer(nivel.valor)}
              className={`${BASE} flex items-center gap-3 px-4 py-3 sm:flex-col sm:gap-2 sm:py-5 sm:text-center ${
                value === nivel.valor ? SELECTED : IDLE
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-base ${
                  value === nivel.valor
                    ? 'bg-bistre text-cream dark:bg-cream dark:text-bistre'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {nivel.valor}
              </span>
              <span className="text-xs font-medium sm:text-[13px]">{nivel.etiqueta}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
