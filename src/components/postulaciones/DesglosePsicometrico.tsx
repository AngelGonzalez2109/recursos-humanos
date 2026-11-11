import { AREAS, CATALOGO, PREGUNTAS_POR_AREA, ordenarAreas } from '../../lib/examenAreas'
import type { Dispositivo, ResultadoPsicometrico } from '../../types/examen'
import { NivelTile } from './NivelTile'

const DISPOSITIVO_LABELS: Record<Dispositivo, string> = {
  movil: 'móvil',
  tablet: 'tableta',
  escritorio: 'computadora',
}

/** Dimensiones del examen global anterior (versión 1), que ya no se aplica */
const DIMENSIONES_V1 = [
  { id: 'logica', nombre: 'Lógica' },
  { id: 'adaptabilidad', nombre: 'Adaptabilidad' },
  { id: 'trabajo_equipo', nombre: 'Trabajo en equipo' },
  { id: 'liderazgo', nombre: 'Liderazgo' },
  { id: 'tolerancia_estres', nombre: 'Tolerancia al estrés' },
]

const GRID = 'grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4'

/** Resultado de la evaluación, por bloque (vista del reclutador): siempre Bajo / Medio / Alto, nunca el porcentaje */
export function DesglosePsicometrico({ resultado }: { resultado: ResultadoPsicometrico }) {
  const legado = resultado.version < 2
  const total = resultado.total_preguntas ?? 30
  const ids = ordenarAreas(resultado.areas ?? [])
  const respondidasDe = (prefijo: string) =>
    Object.keys(resultado.respuestas ?? {}).filter((k) => k.startsWith(`${prefijo}-`)).length

  const meta = [
    `${resultado.respondidas} de ${total} respondidas`,
    resultado.dispositivo && `desde ${DISPOSITIVO_LABELS[resultado.dispositivo]}`,
    resultado.por_tiempo && 'enviada por tiempo agotado',
  ].filter(Boolean)

  return (
    <section className="inset-panel space-y-4 p-4 sm:p-5" aria-label={CATALOGO.titulo}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="eyebrow text-slate-800 dark:text-slate-200">
          {CATALOGO.titulo}
          {legado && ' · versión anterior'}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400">{meta.join(' · ')}</p>
      </div>
      <div className={GRID}>
        {legado
          ? DIMENSIONES_V1.map((d) => (
              <NivelTile key={d.id} nombre={d.nombre} valor={resultado.puntajes[d.id] ?? null} />
            ))
          : AREAS.filter((a) => ids.includes(a.id)).map((area) => (
              <NivelTile
                key={area.id}
                nombre={area.nombre_corto}
                valor={resultado.puntajes[area.id] ?? null}
                detalle={`${respondidasDe(area.prefijo)} de ${PREGUNTAS_POR_AREA} respondidas`}
              />
            ))}
      </div>
    </section>
  )
}
