import { Link } from 'react-router-dom'
import { EXAMEN } from '../../lib/examen'

/** Confirmación final: no muestra puntajes */
export function ExamenDone() {
  return (
    <div
      role="status"
      className="mx-auto max-w-lg animate-fade-in surface px-6 py-14 text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100/70 text-emerald-700 ring-1 ring-emerald-600/25 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/25">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-8 w-8" aria-hidden="true">
          <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-6 text-3xl leading-tight">{EXAMEN.mensaje_final}</h1>
      <p className="mx-auto mt-3 max-w-sm text-sm text-slate-600 dark:text-slate-400">
        Gracias por completar la {EXAMEN.titulo}. Puedes seguir el estado de tu postulación en cualquier momento.
      </p>
      <Link
        to="/mis-postulaciones"
        className="mt-8 inline-block rounded-full bg-bistre px-6 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ash dark:bg-cream dark:text-bistre dark:hover:bg-bone"
      >
        Ir a mis postulaciones
      </Link>
    </div>
  )
}
