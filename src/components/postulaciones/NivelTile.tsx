import { CATALOGO, nivelDe } from '../../lib/examenAreas'
import { NIVEL_FILL, NIVEL_TEXT, type NivelId } from '../../lib/nivelEstilos'

const NIVELES = CATALOGO.niveles

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
            style={{ animationDelay: `${150 + i * 130}ms` }}
            className={`h-2 flex-1 origin-left rounded-full ${
              nivel && i <= alcanzado
                ? `animate-seg-in ${NIVEL_FILL[nivel]}`
                : 'bg-slate-200 dark:bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

interface NivelTileProps {
  nombre: string
  /** Porcentaje 0-100 (nunca se muestra): solo se traduce a Bajo / Medio / Alto */
  valor: number | null
  detalle?: string
}

/** Resultado de un bloque como nivel (Bajo / Medio / Alto) con su medidor */
export function NivelTile({ nombre, valor, detalle }: NivelTileProps) {
  const nivel = valor === null ? null : nivelDe(valor)

  return (
    <div className="rounded-sm bg-white p-4 ring-1 ring-bistre/10 ring-inset dark:bg-slate-900/60 dark:ring-white/10">
      <p className="eyebrow lg:min-h-[2.4em]">{nombre}</p>
      <p className={`mt-2 mb-4 font-display text-3xl leading-none ${nivel ? NIVEL_TEXT[nivel.id] : 'text-slate-500'}`}>
        {nivel ? nivel.etiqueta : 'Sin datos'}
      </p>
      <NivelMeter nivel={nivel?.id ?? null} nombre={nombre} />
      {detalle && (
        <p className="mt-1.5 font-mono text-[10px] tracking-[0.1em] text-slate-600 uppercase dark:text-slate-400">
          {detalle}
        </p>
      )}
    </div>
  )
}
