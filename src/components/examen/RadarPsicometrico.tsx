import { nivelDe } from '../../lib/examenAreas'
import { NIVEL_SVG_FILL, type PuntajeArea } from '../../lib/nivelEstilos'
import { RadarEtiqueta } from './RadarEtiqueta'

// El centro queda fijo (el polígono crece desde él); la altura se recorta según los vértices de abajo
const W = 400
const CX = W / 2
const CY = 175
const R = 80
const ANILLOS = [25, 50, 75, 100]
/** Umbrales Medio (50) y Alto (75): sus anillos se resaltan */
const UMBRALES = new Set([50, 75])

const punto = (i: number, n: number, pct: number) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / n
  const r = (R * pct) / 100
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a), cos: Math.cos(a), sin: Math.sin(a) }
}

const poligono = (n: number, pcts: number[]) =>
  pcts.map((p, i) => { const { x, y } = punto(i, n, p); return `${x.toFixed(1)},${y.toFixed(1)}` }).join(' ')

export const describirPuntaje = ({ nombre, valor }: PuntajeArea) =>
  valor === null ? `${nombre}: sin datos` : `${nombre}: ${Math.round(valor)} %, nivel ${nivelDe(valor).etiqueta}`

/** Gráfica de red (radar): un vértice por área, escala 0-100 con anillos punteados. Requiere ≥ 3 áreas */
export function RadarPsicometrico({ items }: { items: PuntajeArea[] }) {
  const n = items.length
  const valores = items.map((it) => Math.min(100, Math.max(0, it.valor ?? 0)))
  // Espacio para el vértice más bajo y su etiqueta (hasta tres líneas debajo de él)
  const bajo = Math.max(...items.map((_, i) => punto(i, n, 100).sin))
  const H = Math.round(CY + (R + 12) * bajo + 58)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Gráfica de red del resultado por área. ${items.map(describirPuntaje).join('; ')}.`}
      className="mx-auto block h-auto w-full max-w-md overflow-visible"
    >
      {ANILLOS.map((p) => (
        <polygon
          key={p}
          points={poligono(n, Array(n).fill(p))}
          fill="none"
          strokeDasharray={UMBRALES.has(p) ? '3 3' : '1.5 3.5'}
          className={UMBRALES.has(p) ? 'stroke-bistre/45 dark:stroke-cream/45' : 'stroke-bistre/20 dark:stroke-cream/20'}
        />
      ))}
      {items.map((it, i) => {
        const { x, y } = punto(i, n, 100)
        return (
          <line key={it.id} x1={CX} y1={CY} x2={x} y2={y} strokeDasharray="1.5 3.5" className="stroke-bistre/20 dark:stroke-cream/20" />
        )
      })}
      {[50, 75].map((p) => (
        <text key={p} x={CX + 4} y={CY - (R * p) / 100 - 3} className="fill-slate-500 font-mono text-[9px] dark:fill-slate-400">
          {p}
        </text>
      ))}

      <g className="animate-radar-in" style={{ transformBox: 'view-box', transformOrigin: `${CX}px ${CY}px` }}>
        <polygon
          points={poligono(n, valores)}
          strokeWidth={1.5}
          strokeLinejoin="round"
          className="fill-chartreuse/45 stroke-bistre dark:fill-chartreuse/20 dark:stroke-cream"
        />
        {items.map((it, i) => {
          if (it.valor === null) return null
          const { x, y } = punto(i, n, valores[i])
          return (
            <circle
              key={it.id}
              cx={x}
              cy={y}
              r={4}
              strokeWidth={1.5}
              className={`stroke-cream dark:stroke-slate-900 ${NIVEL_SVG_FILL[nivelDe(it.valor).id]}`}
            >
              <title>{describirPuntaje(it)}</title>
            </circle>
          )
        })}
      </g>

      {items.map((it, i) => {
        const { x, y, cos, sin } = punto(i, n, 100)
        return <RadarEtiqueta key={it.id} item={it} x={x + cos * 12} y={y + sin * 12} cos={cos} sin={sin} />
      })}
    </svg>
  )
}
