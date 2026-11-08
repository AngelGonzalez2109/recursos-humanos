import { BONO_HABILIDAD, type MatchResultado } from '../../lib/match'
import { ProgressBar } from '../ui/ProgressBar'

function tone(porcentaje: number) {
  if (porcentaje >= 75) {
    return { text: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-600 dark:bg-emerald-400' }
  }
  if (porcentaje >= 50) {
    return { text: 'text-slate-900 dark:text-slate-100', bar: 'bg-bistre dark:bg-cream' }
  }
  return { text: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500 dark:bg-amber-400' }
}

const CHIP =
  'rounded-full px-2.5 py-0.5 text-xs text-slate-700 ring-1 ring-bistre/15 ring-inset dark:text-slate-300 dark:ring-white/15'

/** "Cumple con el 85% de los requisitos" + barra animada y desglose por criterio */
export function MatchIndicator({ match }: { match: MatchResultado }) {
  if (match.porcentaje === null) {
    return (
      <p className="text-xs text-slate-600 dark:text-slate-400">
        Esta vacante no define requisitos estructurados, por lo que no se calcula compatibilidad.
      </p>
    )
  }

  const { text, bar } = tone(match.porcentaje)

  return (
    <div className="inset-panel space-y-4 p-5">
      <div className="flex items-center gap-4">
        <p className={`font-serif text-5xl leading-none tabular-nums ${text}`}>
          {match.porcentaje}
          <span className="text-2xl">%</span>
        </p>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Cumple con el {match.porcentaje}% de los requisitos
          </p>
          <ProgressBar value={match.porcentaje} label="Compatibilidad con la vacante" barClassName={bar} />
        </div>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {match.criterios.map((c) => (
          <li key={c.id} className={CHIP}>
            {c.label}: <span className="font-medium tabular-nums">{Math.round(c.score * 100)}%</span>
          </li>
        ))}
        {match.habilidadesRequeridas > 0 && (
          <li className={CHIP}>
            Habilidades: <span className="font-medium tabular-nums">{match.habilidadesCoincidentes.length}</span> de{' '}
            {match.habilidadesRequeridas} (+{match.habilidadesCoincidentes.length * BONO_HABILIDAD}%)
          </li>
        )}
      </ul>
    </div>
  )
}
