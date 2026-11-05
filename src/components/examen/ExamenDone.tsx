import { Link } from 'react-router-dom'
import { EXAMEN } from '../../lib/examen'

/** Confirmación final: no muestra puntajes */
export function ExamenDone() {
  return (
    <div
      role="status"
      className="mx-auto max-w-lg animate-fade-in surface px-6 py-12 text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-8 w-8" aria-hidden="true">
          <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-5 text-xl font-semibold">{EXAMEN.mensaje_final}</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Gracias por completar la {EXAMEN.titulo}. Puedes seguir el estado de tu postulación en cualquier momento.
      </p>
      <Link
        to="/mis-postulaciones"
        className="mt-6 inline-block rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
      >
        Ir a mis postulaciones
      </Link>
    </div>
  )
}
