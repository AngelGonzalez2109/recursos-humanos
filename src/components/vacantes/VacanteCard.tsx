import { Link } from 'react-router-dom'
import { formatFechaRelativa, formatSalario } from '../../lib/vacanteFormat'
import type { Vacante } from '../../types/vacante'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { VacanteBadges } from './VacanteBadges'

const MAX_TAGS = 3

interface VacanteCardProps {
  vacante: Vacante
  /** Posición en la lista: escalona la animación de entrada */
  index?: number
}

export function VacanteCard({ vacante, index = 0 }: VacanteCardProps) {
  const extras = vacante.habilidades.length - MAX_TAGS

  return (
    <Link
      to={`/vacantes/${vacante.id}`}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className="group surface surface-interactive flex animate-fade-in flex-col p-6"
    >
      <div className="flex items-start gap-3">
        <Avatar name={vacante.empresa} shape="square" />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-3 text-xl leading-snug">
            {vacante.titulo}
          </h3>
          <p className="truncate text-sm text-slate-600 dark:text-slate-400">
            {vacante.empresa} · {vacante.ubicacion}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="mt-1 text-slate-500 transition-[transform,color] duration-200 group-hover:translate-x-1 group-hover:text-bistre dark:text-slate-500 dark:group-hover:text-cream"
        >
          →
        </span>
      </div>

      <div className="mt-4">
        <VacanteBadges vacante={vacante} />
      </div>

      {vacante.habilidades.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {vacante.habilidades.slice(0, MAX_TAGS).map((h) => (
            <Badge key={h} variant="muted">
              {h}
            </Badge>
          ))}
          {extras > 0 && <Badge variant="muted">+{extras}</Badge>}
        </div>
      )}

      <div className="mt-auto pt-6">
        <div className="hairline-t flex items-end justify-between gap-2 pt-4 text-sm">
          <span className="font-medium text-slate-900 tabular-nums dark:text-slate-100">{formatSalario(vacante)}</span>
          <span className="eyebrow shrink-0">{formatFechaRelativa(vacante.created_at)}</span>
        </div>
      </div>
    </Link>
  )
}

export function VacanteCardSkeleton() {
  return (
    <div className="surface animate-pulse p-6">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-sm bg-slate-200 dark:bg-slate-800" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-20 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-5 w-24 rounded bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="mt-6 h-4 w-2/5 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  )
}
