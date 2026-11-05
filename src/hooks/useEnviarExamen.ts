import { useCallback, useEffect, useRef, useState } from 'react'
import { getDbErrorMessage } from '../lib/dbErrors'
import { enviarExamen } from '../lib/examenService'
import type { RespuestasExamen } from '../types/examen'

interface Options {
  postulacionId: string
  answers: RespuestasExamen
  /** true cuando se agotó el tiempo: dispara el envío automático */
  expired: boolean
  clear: () => void
  onDone: () => void
}

function errorCode(error: unknown): string {
  return error && typeof error === 'object' && 'code' in error ? String(error.code) : ''
}

/**
 * Envío de la evaluación. Se llama manualmente con submit(), o solo cuando
 * `expired` pasa a true (envío automático por tiempo agotado). Si el envío
 * automático falla, el reintento es manual para no entrar en un bucle.
 */
export function useEnviarExamen({ postulacionId, answers, expired, clear, onDone }: Options) {
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sendingRef = useRef(false)

  const submit = useCallback(
    async (porTiempo: boolean) => {
      if (sendingRef.current) return
      sendingRef.current = true
      setSending(true)
      setError(null)
      try {
        await enviarExamen(postulacionId, answers, porTiempo)
        clear()
        onDone()
      } catch (err) {
        // 23505: ya existía un envío (único intento) → se considera enviado
        if (errorCode(err) === '23505') {
          clear()
          onDone()
          return
        }
        console.error('Error al enviar la evaluación:', err)
        setError(
          errorCode(err) === '42501'
            ? 'La evaluación ya no está habilitada para esta postulación.'
            : getDbErrorMessage(err),
        )
        sendingRef.current = false
        setSending(false)
      }
    },
    [postulacionId, answers, clear, onDone],
  )

  const submitRef = useRef(submit)
  useEffect(() => {
    submitRef.current = submit
  })
  useEffect(() => {
    if (expired) void submitRef.current(true)
  }, [expired])

  return { sending, error, submit }
}
