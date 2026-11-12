import { nivelDe } from '../../lib/examenAreas'
import { NIVEL_FILL, NIVEL_TEXT, type PuntajeArea } from '../../lib/nivelEstilos'
import { RadarPsicometrico } from '../examen/RadarPsicometrico'
import { CountUp } from '../ui/CountUp'
import { ProgressBar } from '../ui/ProgressBar'

/** Mínimo de ejes para dibujar la gráfica de red; con menos se usan barras */
const MIN_RADAR = 3

/** Fila de la leyenda: nombre, nivel en texto y porcentaje exacto (con barra si no hay radar) */
function FilaPuntaje({ item, conBarra }: { item: PuntajeArea; conBarra: boolean }) {
  const nivel = item.valor === null ? null : nivelDe(item.valor)

  return (
    <li className="py-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="min-w-0 text-sm text-slate-800 dark:text-slate-200">{item.nombre}</span>
        <span className="flex shrink-0 items-baseline gap-2">
          <span className={`eyebrow ${nivel ? NIVEL_TEXT[nivel.id] : ''}`}>{nivel ? nivel.etiqueta : 'Sin datos'}</span>
          <span className="w-14 text-right font-display text-lg leading-none text-bistre dark:text-cream">
            {item.valor === null ? '—' : <><CountUp value={Math.round(item.valor)} /> %</>}
          </span>
        </span>
      </div>
      {conBarra && item.valor !== null && nivel && (
        <div className="mt-2">
          <ProgressBar value={item.valor} label={`${item.nombre}: ${Math.round(item.valor)} %`} barClassName={NIVEL_FILL[nivel.id]} />
        </div>
      )}
      {item.detalle && (
        <p className="mt-1 font-mono text-[10px] tracking-[0.1em] text-slate-600 uppercase dark:text-slate-400">
          {item.detalle}
        </p>
      )}
    </li>
  )
}

/** Vista avanzada: radar con porcentajes exactos (≥ 3 áreas) o barras por área (1-2 áreas), más su leyenda */
export function VistaAvanzada({ items }: { items: PuntajeArea[] }) {
  const radar = items.length >= MIN_RADAR

  return (
    <div className="animate-fade-in space-y-3">
      {radar ? (
        <RadarPsicometrico items={items} />
      ) : (
        <p className="text-xs text-slate-600 dark:text-slate-400">
          La gráfica de red necesita al menos {MIN_RADAR} áreas; se muestra el porcentaje de cada una en barras.
        </p>
      )}
      <ul className="list-hairline" aria-label="Porcentaje y nivel por área">
        {items.map((it) => (
          <FilaPuntaje key={it.id} item={it} conBarra={!radar} />
        ))}
      </ul>
    </div>
  )
}
