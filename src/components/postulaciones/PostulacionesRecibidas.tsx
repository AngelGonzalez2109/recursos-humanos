import { useCallback, useMemo, useState } from 'react'
import { useResultadosVacante } from '../../hooks/useExamen'
import { usePostulaciones } from '../../hooks/usePostulaciones'
import { ordenarPorMatch } from '../../lib/match'
import type { Vacante } from '../../types/vacante'
import { Button } from '../ui/Button'
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

  // Candidatos desplegados (por id): todos empiezan cerrados para poder recorrer la lista
  const [abiertos, setAbiertos] = useState<Set<string>>(new Set())
  const toggle = useCallback((id: string) => {
    setAbiertos((prev) => {
      const next = new Set(prev)
      if (!next.delete(id)) next.add(id)
      return next
    })
  }, [])
  const todosAbiertos = ordenadas.length > 0 && ordenadas.every((o) => abiertos.has(o.postulacion.id))

  let content
  if (loading) content = <div className="h-16 animate-pulse rounded-sm bg-slate-100 dark:bg-slate-800" />
  else if (error) content = <LoadError message={error} onRetry={reload} />
  else if (ordenadas.length === 0) {
    content = <p className="text-sm text-slate-600 dark:text-slate-400">Aún no hay postulaciones.</p>
  } else {
    content = (
      <ul className="space-y-3">
        {ordenadas.map((item, index) => (
          <PostulacionCard
            key={item.postulacion.id}
            item={item}
            index={index}
            resultado={porPostulacion.get(item.postulacion.id)}
            sinAreas={(vacante.areas_evaluacion ?? []).length === 0}
            open={abiertos.has(item.postulacion.id)}
            onToggle={() => toggle(item.postulacion.id)}
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
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-2">Candidatos</p>
          <h2 className="text-2xl">Postulaciones recibidas{data ? ` (${data.length})` : ''}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Ordenadas de mayor a menor compatibilidad.</p>
        </div>
        {ordenadas.length > 1 && (
          <Button
            variant="secondary"
            onClick={() => setAbiertos(todosAbiertos ? new Set() : new Set(ordenadas.map((o) => o.postulacion.id)))}
          >
            {todosAbiertos ? 'Contraer todos' : 'Expandir todos'}
          </Button>
        )}
      </div>
      {content}
    </section>
  )
}
