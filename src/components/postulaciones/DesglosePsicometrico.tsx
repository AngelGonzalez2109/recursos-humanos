import { EXAMEN, TOTAL_PREGUNTAS, nivelDe } from '../../lib/examen'
import { ProgressBar } from '../ui/ProgressBar'
import type { DimensionExamen, NivelExamen, ResultadoPsicometrico } from '../../types/examen'

type NivelId = NivelExamen['id']

const NIVELES: { id: NivelId; etiqueta: string }[] = [
  { id: 'bajo', etiqueta: 'Bajo' },
  { id: 'medio', etiqueta: 'Medio' },
  { id: 'alto', etiqueta: 'Alto' },
]

const NIVEL_TEXT: Record<NivelId, string> = {
  alto: 'text-emerald-600 dark:text-emerald-400',
  medio: 'text-amber-600 dark:text-amber-400',
  bajo: 'text-red-600 dark:text-red-400',
}

const NIVEL_FILL: Record<NivelId, string> = {
  alto: 'bg-emerald-600 dark:bg-emerald-400',
  medio: 'bg-amber-500 dark:bg-amber-400',
  bajo: 'bg-red-500 dark:bg-red-400',
}

const TILE =
  'rounded-sm bg-white p-4 ring-1 ring-bistre/10 ring-inset dark:bg-slate-900/60 dark:ring-white/10'

/** Medidor de tres tramos: se iluminan los alcanzados; el nivel se dice en el texto de la tarjeta */
function NivelMeter({ nivel, nombre }: { nivel: NivelId | null; nombre: string }) {
  const alcanzado = nivel ? NIVELES.findIndex((n) => n.id === nivel) : -1
  const etiqueta = nivel ? NIVELES[alcanzado].etiqueta : 'sin resultado'

  return (
    <div role="img" aria-label={`${nombre}: nivel ${etiqueta}`}>
      <div className="flex gap-1">
        {NIVELES.map((n, i) => (
          <span
            key={n.id}
            className={`h-2 flex-1 rounded-full ${
              nivel && i <= alcanzado ? NIVEL_FILL[nivel] : 'bg-slate-200 dark:bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

/** Dimensión de nivel (escala Likert): nunca se muestra el número, solo Bajo / Medio / Alto */
function NivelTile({ dimension, valor }: { dimension: DimensionExamen; valor: number | null }) {
  const nivel = valor === null ? null : (nivelDe(dimension, valor)?.id ?? null)

  return (
    <div className={TILE}>
      <p className="eyebrow lg:min-h-[2.4em]">{dimension.nombre_corto}</p>
      <p className={`mt-2 mb-4 font-display text-3xl leading-none ${nivel ? NIVEL_TEXT[nivel] : 'text-slate-500'}`}>
        {nivel ? NIVELES.find((n) => n.id === nivel)?.etiqueta : 'Sin datos'}
      </p>
      <NivelMeter nivel={nivel} nombre={dimension.nombre} />
    </div>
  )
}

/** Dimensión en porcentaje (lógica): cifra grande, barra y aciertos sobre el total de preguntas */
function PorcentajeTile({ dimension, valor }: { dimension: DimensionExamen; valor: number | null }) {
  const total = EXAMEN.preguntas.filter((p) => p.dimension === dimension.id).length
  const aciertos = valor === null ? null : Math.round((valor / 100) * total)

  return (
    <div className={TILE}>
      <p className="eyebrow lg:min-h-[2.4em]">{dimension.nombre_corto}</p>
      <p className="mt-2 mb-4 font-display text-3xl leading-none text-slate-900 tabular-nums dark:text-slate-100">
        {valor === null ? 'Sin datos' : `${valor}%`}
      </p>
      <ProgressBar
        value={valor ?? 0}
        label={dimension.nombre}
        barClassName="bg-bistre dark:bg-cream"
        heightClassName="h-2"
      />
      <p className="mt-1.5 font-mono text-[10px] tracking-[0.1em] text-slate-600 uppercase dark:text-slate-400">
        {aciertos === null ? 'Sin respuestas' : `${aciertos} de ${total} aciertos`}
      </p>
    </div>
  )
}

/** Resultado de la Evaluación de Perfil Profesional, por dimensión (vista del reclutador) */
export function DesglosePsicometrico({ resultado }: { resultado: ResultadoPsicometrico }) {
  return (
    <section className="inset-panel space-y-4 p-4 sm:p-5" aria-label={EXAMEN.titulo}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="eyebrow text-slate-800 dark:text-slate-200">{EXAMEN.titulo}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {resultado.respondidas} de {TOTAL_PREGUNTAS} respondidas
          {resultado.por_tiempo ? ' · enviada por tiempo agotado' : ''}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-5">
        {EXAMEN.dimensiones.map((dimension) => {
          const valor = resultado.puntajes[dimension.id] ?? null
          return dimension.presentacion === 'nivel' ? (
            <NivelTile key={dimension.id} dimension={dimension} valor={valor} />
          ) : (
            <PorcentajeTile key={dimension.id} dimension={dimension} valor={valor} />
          )
        })}
      </div>
    </section>
  )
}
