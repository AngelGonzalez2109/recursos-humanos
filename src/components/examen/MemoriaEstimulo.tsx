import { useEffect, useState } from 'react'
import { EXAMEN } from '../../lib/examen'
import { Button } from '../ui/Button'

export type FaseMemoria = 'sin_memoria' | 'listo' | 'mostrando' | 'oculto'

/**
 * Fase de una pregunta de memoria: «listo» (aún no se ve la secuencia),
 * «mostrando» (visible unos segundos) y «oculto» (ya se ocultó; se responde).
 * `inicio` es la marca de tiempo (ms) en que se mostró; vive en el progreso
 * guardado, así que recargar no permite volver a verla.
 */
export function useFaseMemoria(inicio: number | undefined, hayMemoria: boolean) {
  const [now, setNow] = useState(() => Date.now())
  const fin = inicio === undefined ? 0 : inicio + EXAMEN.segundos_memorizar * 1000
  const activa = hayMemoria && inicio !== undefined && now < fin

  useEffect(() => {
    if (!activa) return
    const id = window.setInterval(() => setNow(Date.now()), 100)
    return () => window.clearInterval(id)
  }, [activa])

  let fase: FaseMemoria = 'oculto'
  if (!hayMemoria) fase = 'sin_memoria'
  else if (inicio === undefined) fase = 'listo'
  else if (activa) fase = 'mostrando'

  return { fase, restanteMs: Math.max(0, fin - now) }
}

interface MemoriaEstimuloProps {
  fase: Extract<FaseMemoria, 'listo' | 'mostrando'>
  secuencia: string
  restanteMs: number
  disabled: boolean
  onMostrar: () => void
}

/** Muestra (o prepara) la secuencia que hay que recordar antes de contestar */
export function MemoriaEstimulo({ fase, secuencia, restanteMs, disabled, onMostrar }: MemoriaEstimuloProps) {
  const total = EXAMEN.segundos_memorizar * 1000

  if (fase === 'listo') {
    return (
      <div className="inset-panel space-y-4 px-5 py-6">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Verás una secuencia durante {EXAMEN.segundos_memorizar} segundos y después se ocultará. Solo se muestra una vez.
        </p>
        <Button disabled={disabled} onClick={onMostrar}>
          Mostrar secuencia
        </Button>
      </div>
    )
  }

  return (
    <div className="inset-panel animate-fade-in px-5 py-8 text-center" role="status" aria-live="polite">
      <p className="eyebrow mb-4">Memoriza</p>
      <p className="font-display text-4xl leading-tight tabular-nums sm:text-5xl">{secuencia}</p>
      <div className="mx-auto mt-6 h-1.5 max-w-xs overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-bistre transition-[width] duration-100 ease-linear dark:bg-cream"
          style={{ width: `${(restanteMs / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
