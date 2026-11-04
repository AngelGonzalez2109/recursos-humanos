import { Link } from 'react-router-dom'
import { formatFechaRelativa, formatSalario } from '../../lib/vacanteFormat'
import type { Vacante } from '../../types/vacante'
import { VacanteBadges } from './VacanteBadges'

export function VacanteCard({ vacante }: { vacante: Vacante }) {
  return (
    <Link
      to={`/vacantes/${vacante.id}`}
      className="group flex animate-fade-in flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/50"
    >
      <h3 className="text-base font-semibold transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-500">
        {vacante.titulo}
      </h3>
      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
        {vacante.empresa} · {vacante.ubicacion}
      </p>
      <div className="mt-3">
        <VacanteBadges vacante={vacante} />
      </div>
      <div className="mt-auto flex items-end justify-between gap-2 pt-4 text-sm">
        <span className="font-medium text-slate-900 dark:text-slate-100">{formatSalario(vacante)}</span>
        <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
          {formatFechaRelativa(vacante.created_at)}
        </span>
      </div>
    </Link>
  )
}

export function VacanteCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-2 h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-20 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-5 w-24 rounded bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="mt-6 h-4 w-2/5 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  )
}
