import { EXAMEN, TOTAL_PREGUNTAS, nivelDe } from '../../lib/examen'
import { ProgressBar } from '../ui/ProgressBar'
import type { DimensionExamen, ResultadoPsicometrico } from '../../types/examen'

const NIVEL_STYLES = {
  alto: 'text-emerald-600 dark:text-emerald-400',
  medio: 'text-amber-600 dark:text-amber-400',
  bajo: 'text-red-600 dark:text-red-400',
} as const

const BAR_STYLES = {
  alto: 'bg-emerald-500',
  medio: 'bg-amber-500',
  bajo: 'bg-red-500',
} as const

function Tile({ dimension, valor }: { dimension: DimensionExamen; valor: number | null }) {
  const nivel = valor === null ? null : nivelDe(dimension, valor)
  const esNivel = dimension.presentacion === 'nivel'
  const texto = valor === null ? 'Sin respuestas' : esNivel ? (nivel?.etiqueta ?? '—') : `${valor}%`
  const color = esNivel && nivel ? NIVEL_STYLES[nivel.id] : ''
  const barColor = esNivel && nivel ? BAR_STYLES[nivel.id] : 'bg-linear-to-r from-brand-600 to-brand-400'

  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200 ring-inset dark:bg-slate-900/60 dark:ring-white/5">
      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{dimension.nombre_corto}</p>
      <p className={`mt-0.5 text-sm font-semibold ${color}`}>{texto}</p>
      <div className="mt-1.5">
        <ProgressBar value={valor ?? 0} label={dimension.nombre} barClassName={barColor} heightClassName="h-1.5" />
      </div>
    </div>
  )
}

/** Resultado de la Evaluación de Perfil Profesional, por dimensión (vista del reclutador) */
export function DesglosePsicometrico({ resultado }: { resultado: ResultadoPsicometrico }) {
  return (
    <div className="space-y-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-950/50">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300">
          {EXAMEN.titulo}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {resultado.respondidas} de {TOTAL_PREGUNTAS} respondidas
          {resultado.por_tiempo ? ' · enviada por tiempo agotado' : ''}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {EXAMEN.dimensiones.map((dimension) => (
          <Tile key={dimension.id} dimension={dimension} valor={resultado.puntajes[dimension.id] ?? null} />
        ))}
      </div>
    </div>
  )
}
