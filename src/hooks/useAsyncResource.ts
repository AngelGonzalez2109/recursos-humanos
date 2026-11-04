import { useCallback, useEffect, useState } from 'react'

interface ResourceState<T> {
  key: string
  version: number
  data: T | null
  error: string | null
}

/**
 * Carga datos asociados a una clave (id, usuario...). `fetcher` debe ser
 * estable (función de módulo). Mientras recarga conserva los datos previos.
 */
export function useAsyncResource<T>(key: string | null, fetcher: (key: string) => Promise<T>) {
  const [state, setState] = useState<ResourceState<T> | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!key) return
    let cancelled = false
    fetcher(key)
      .then((data) => {
        if (!cancelled) setState({ key, version, data, error: null })
      })
      .catch((error: unknown) => {
        console.error('Error al cargar datos:', error)
        if (!cancelled) {
          setState({ key, version, data: null, error: 'No se pudo cargar la información.' })
        }
      })
    return () => {
      cancelled = true
    }
  }, [key, version, fetcher])

  const reload = useCallback(() => setVersion((v) => v + 1), [])

  const sameKey = key !== null && state?.key === key
  const upToDate = sameKey && state?.version === version

  return {
    data: sameKey ? (state?.data ?? null) : null,
    error: upToDate ? (state?.error ?? null) : null,
    /** true si no hay datos que mostrar todavía (primera carga o reintento tras error) */
    loading: key !== null && (!sameKey || (!upToDate && state?.data === null)),
    reload,
  }
}
