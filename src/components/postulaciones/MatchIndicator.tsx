import type { MatchResultado } from '../../lib/match'

function barColor(porcentaje: number): string {
  if (porcentaje >= 75) return 'bg-emerald-500'
  if (porcentaje >= 50) return 'bg-brand-500'
  return 'bg-amber-500'
}

/** "Cumple con el 85% de los requisitos" + barra y desglose por criterio */
export function MatchIndicator({ match }: { match: MatchResultado }) {
  if (match.porcentaje === null) {
    return (
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Esta vacante no define requisitos estructurados, por lo que no se calcula compatibilidad.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Cumple con el {match.porcentaje}% de los requisitos</p>
      <div
        role="progressbar"
        aria-valuenow={match.porcentaje}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Compatibilidad con la vacante"
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor(match.porcentaje)}`}
          style={{ width: `${match.porcentaje}%` }}
        />
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        {match.criterios.map((c) => (
          <li key={c.id}>
            {c.label}: <span className="font-medium">{Math.round(c.score * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
