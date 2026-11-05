import { useMemo } from 'react'
import { useResultadosVacante } from '../../hooks/useExamen'
import { usePostulaciones } from '../../hooks/usePostulaciones'
import { ordenarPorMatch } from '../../lib/match'
import type { Vacante } from '../../types/vacante'
import { LoadError } from '../vacantes/LoadError'
import { PostulacionCard } from './PostulacionCard'

/** Candidatos de una vacante, de mayor a menor compatibilidad (solo su publicador) */
export function PostulacionesRecibidas({ vacante }: { vacante: Vacante }) {
  const { data, loading, error, reload } = usePostulaciones(vacante.id)
  const resultados = useResultadosVacante(vacante.id)
  const porPostulacion = useMemo(
    () => new Map((resultados.data ?? []).map((r) => [r.postulacion_id, r])),
    [resultados.data],
  )
  const ordenadas = useMemo(() => (data ? ordenarPorMatch(vacante, data) : []), [vacante, data])

  let content
  if (loading) content = <div className="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
  else if (error) content = <LoadError message={error} onRetry={reload} />
  else if (ordenadas.length === 0) {
    content = <p className="text-sm text-slate-500 dark:text-slate-400">Aún no hay postulaciones.</p>
  } else {
    content = (
      <ul className="divide-y divide-slate-200 dark:divide-slate-800">
        {ordenadas.map((item) => (
          <PostulacionCard
            key={item.postulacion.id}
            item={item}
            resultado={porPostulacion.get(item.postulacion.id)}
            onChanged={() => {
              reload()
              resultados.reload()
            }}
          />
        ))}
      </ul>
    )
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-semibold">
        Postulaciones recibidas{data ? ` (${data.length})` : ''}
      </h2>
      <p className="mt-1 mb-4 text-xs text-slate-500 dark:text-slate-400">Ordenadas de mayor a menor compatibilidad.</p>
      {content}
    </section>
  )
}
