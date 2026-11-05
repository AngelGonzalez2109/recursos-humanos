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
  'cursor-pointer rounded-xl border text-left text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60'
const IDLE =
  'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-md dark:border-slate-700 dark:bg-slate-900'
const SELECTED = 'border-brand-500 bg-brand-50 shadow-md ring-2 ring-brand-500/30 dark:bg-brand-900/30'

/** Una pregunta: opción múltiple (A-D) o escala Likert (1-5) */
export function PreguntaCard({ pregunta, numero, value, disabled, onAnswer }: PreguntaCardProps) {
  const seccion = seccionDe(pregunta)

  return (
    <section key={pregunta.id} className="animate-fade-in space-y-6" aria-labelledby={`q-${pregunta.id}`}>
      <div>
        <p className="text-xs font-semibold tracking-wide text-brand-600 uppercase dark:text-brand-500">
          {seccion.titulo}
        </p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{seccion.indicaciones}</p>
      </div>

      <h2 id={`q-${pregunta.id}`} className="text-xl leading-snug font-semibold sm:text-2xl">
        <span className="mr-2 text-brand-600 dark:text-brand-500">{numero}.</span>
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
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold uppercase ${
                  value === opcion.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
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
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-semibold ${
                  value === nivel.valor
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
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
