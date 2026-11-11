import { useState } from 'react'
import { useCuentaRegresiva, useExamenProgreso } from '../../hooks/useExamen'
import { useEnviarExamen } from '../../hooks/useEnviarExamen'
import { examenStorageKey } from '../../lib/examen'
import type { SesionActiva } from '../../types/examen'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { ExamenBarra } from './ExamenBarra'
import { PreguntaCard } from './PreguntaCard'
import { PreguntaNav } from './PreguntaNav'

interface ExamenEnCursoProps {
  sesion: SesionActiva
  postulacionId: string
  userId: string
  onDone: () => void
}

/** Examen ya iniciado: una pregunta por pantalla, temporizador y envío */
export function ExamenEnCurso({ sesion, postulacionId, userId, onDone }: ExamenEnCursoProps) {
  const { preguntas, startedAt, duracionMs } = sesion
  const total = preguntas.length
  const { progreso, setProgreso, clear } = useExamenProgreso(examenStorageKey(userId, postulacionId))
  const remaining = useCuentaRegresiva(startedAt, duracionMs)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { answers, memoria } = progreso
  const index = Math.min(progreso.index, total - 1)
  const answered = preguntas.filter((p) => answers[p.id] !== undefined).length
  const expired = remaining <= 0
  const { sending, error, submit } = useEnviarExamen({ postulacionId, answers, expired, clear, onDone })
  const locked = sending || expired

  const pregunta = preguntas[index]
  const isLast = index >= total - 1
  const go = (next: number) => setProgreso((p) => ({ ...p, index: next }))
  const pending = total - answered

  return (
    <div className="space-y-6">
      <ExamenBarra remainingMs={remaining} totalMs={duracionMs} answered={answered} total={total} />

      {expired && !error && <Alert variant="info">Se agotó el tiempo. Enviando tus respuestas…</Alert>}
      {error && (
        <div className="space-y-3">
          <Alert variant="error">{error}</Alert>
          <Button variant="secondary" onClick={() => void submit(expired)}>
            Reintentar envío
          </Button>
        </div>
      )}

      <div className="surface p-6 sm:p-8">
        <PreguntaCard
          pregunta={pregunta}
          numero={index + 1}
          value={answers[pregunta.id]}
          disabled={locked}
          memoriaInicio={memoria[pregunta.id]}
          onMemoriaStart={() =>
            setProgreso((p) => ({ ...p, memoria: { ...p.memoria, [pregunta.id]: Date.now() } }))
          }
          onAnswer={(value) =>
            setProgreso((p) => ({ ...p, answers: { ...p.answers, [pregunta.id]: value } }))
          }
        />
        <div className="hairline-t mt-8 flex items-center justify-between gap-3 pt-5">
          <Button variant="secondary" disabled={locked || index === 0} onClick={() => go(index - 1)}>
            ← Anterior
          </Button>
          {isLast ? (
            <Button loading={sending} disabled={expired} onClick={() => setConfirmOpen(true)}>
              Revisar y enviar
            </Button>
          ) : (
            <Button disabled={locked} onClick={() => go(index + 1)}>
              Siguiente →
            </Button>
          )}
        </div>
      </div>

      <div className="surface space-y-3 p-5">
        <PreguntaNav preguntas={preguntas} answers={answers} current={index} disabled={locked} onGo={go} />
        <Button variant="ghost" disabled={locked} onClick={() => setConfirmOpen(true)}>
          Enviar evaluación ahora
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Enviar evaluación"
        confirmLabel="Sí, enviar"
        loading={sending}
        onConfirm={() => {
          setConfirmOpen(false)
          void submit(false)
        }}
        onCancel={() => setConfirmOpen(false)}
      >
        {pending > 0
          ? `Tienes ${pending} ${pending === 1 ? 'pregunta sin responder' : 'preguntas sin responder'}. `
          : ''}
        Solo puedes presentar la evaluación una vez y no podrás modificar tus respuestas. ¿Enviar ahora?
      </ConfirmDialog>
    </div>
  )
}
