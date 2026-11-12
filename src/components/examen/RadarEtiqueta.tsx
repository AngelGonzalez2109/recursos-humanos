import type { PuntajeArea } from '../../lib/nivelEstilos'

const LINEA = 15

/** Parte un nombre largo en dos líneas por el espacio más cercano al centro */
function lineas(nombre: string): string[] {
  if (nombre.length <= 11 || !nombre.includes(' ')) return [nombre]
  const mitad = nombre.length / 2
  let corte = -1
  for (let i = 0; i < nombre.length; i++) {
    if (nombre[i] === ' ' && (corte < 0 || Math.abs(i - mitad) < Math.abs(corte - mitad))) corte = i
  }
  return [nombre.slice(0, corte), nombre.slice(corte + 1)]
}

interface RadarEtiquetaProps {
  item: PuntajeArea
  x: number
  y: number
  cos: number
  sin: number
}

/** Nombre del área y su porcentaje junto a un vértice, alineados hacia fuera del radar */
export function RadarEtiqueta({ item, x, y, cos, sin }: RadarEtiquetaProps) {
  const nombre = lineas(item.nombre)
  const total = nombre.length + 1
  // Solo los vértices casi verticales se centran; los demás se alinean hacia fuera para no chocar entre sí
  const anchor = Math.abs(cos) < 0.15 ? 'middle' : cos > 0 ? 'start' : 'end'
  // Arriba: el bloque termina en el vértice; abajo: empieza en él; a los lados: centrado
  const primera = sin < -0.3 ? y - (total - 1) * LINEA : sin > 0.3 ? y + LINEA * 0.8 : y - ((total - 1) * LINEA) / 2 + 4

  return (
    <text textAnchor={anchor} aria-hidden="true">
      {nombre.map((l, i) => (
        <tspan key={l} x={x} y={primera + i * LINEA} className="fill-slate-600 text-[13px] dark:fill-slate-400">
          {l}
        </tspan>
      ))}
      <tspan x={x} y={primera + nombre.length * LINEA + 2} className="fill-bistre font-display text-[16px] dark:fill-cream">
        {item.valor === null ? '—' : `${Math.round(item.valor)} %`}
      </tspan>
    </text>
  )
}
