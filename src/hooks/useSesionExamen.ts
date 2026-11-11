import { useCallback, useMemo, useState } from 'react'
import { sesionActiva } from '../lib/examen'
import { getDbErrorMessage } from '../lib/dbErrors'
import { obtenerSesionExamen } from '../lib/examenService'
import type { SesionActiva, SesionExamen } from '../types/examen'
import { useAsyncResource } from './useAsyncResource'

const fetchSesion = (postulacionId: string) => obtenerSesionExamen(postulacionId, false)

/**
 * Examen asignado a la postulación. Al cargar solo consulta si ya comenzó
 * (así recargar no reinicia nada); `iniciar` lo crea en la base de datos, que
 * elige las preguntas al azar y fija la hora de inicio.
 */
export function useSesionExamen(postulacionId: string) {
  const recurso = useAsyncResource(postulacionId, fetchSesion)
  const [creada, setCreada] = useState<SesionExamen | null>(null)
  const [iniciando, setIniciando] = useState(false)
  const [errorInicio, setErrorInicio] = useState<string | null>(null)

  const iniciar = useCallback(async () => {
    setIniciando(true)
    setErrorInicio(null)
    try {
      setCreada(await obtenerSesionExamen(postulacionId, true))
    } catch (err) {
      console.error('Error al iniciar la evaluación:', err)
      setErrorInicio(getDbErrorMessage(err))
    } finally {
      setIniciando(false)
    }
  }, [postulacionId])

  const bruta = creada ?? recurso.data
  const sesion: SesionActiva | null = useMemo(() => (bruta ? sesionActiva(bruta) : null), [bruta])

  return { sesion, loading: recurso.loading, error: recurso.error, reload: recurso.reload, iniciar, iniciando, errorInicio }
}
