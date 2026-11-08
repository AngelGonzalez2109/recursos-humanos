import { useState } from 'react'
import { useCuentaRegresiva, useExamenProgreso } from '../../hooks/useExamen'
import { useEnviarExamen } from '../../hooks/useEnviarExamen'
import { EXAMEN, TOTAL_PREGUNTAS, examenStorageKey } from '../../lib/examen'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { ExamenBarra } from './ExamenBarra'
import { ExamenIntro } from './ExamenIntro'
import { PreguntaCard } from './PreguntaCard'
import { PreguntaNav } from './PreguntaNav'

interface ExamenRunnerProps {
  postulacionId: string
  userId: string
  vacanteTitulo: string | null
  onDone: () => void
}

export function ExamenRunner({ postulacionId, userId, vacanteTitulo, onDone }: ExamenRunnerProps) {
  const { progreso, setProgreso, clear } = useExamenProgreso(examenStorageKey(userId, postulacionId))
  const remaining = useCuentaRegresiva(progreso.startedAt)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { answers, index } = progreso
  const answered = Object.keys(answers).length
  const expired = remaining !== null && remaining <= 0
  const { sending, error, submit } = useEnviarExamen({ postulacionId, answers, expired, clear, onDone })
  const locked = sending || expired

  if (progreso.startedAt === null || remaining === null) {
    return (
      <ExamenIntro
        vacanteTitulo={vacanteTitulo}
        onStart={() => setProgreso((p) => ({ ...p, startedAt: Date.now() }))}
      />
    )
  }

  const pregunta = EXAMEN.preguntas[Math.min(index, TOTAL_PREGUNTAS - 1)]
  const isLast = index >= TOTAL_PREGUNTAS - 1
  const go = (next: number) => setProgreso((p) => ({ ...p, index: next }))
  const pending = TOTAL_PREGUNTAS - answered

  return (
    <div className="space-y-6">
      <ExamenBarra remainingMs={remaining} answered={answered} />

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
        <PreguntaNav answers={answers} current={index} disabled={locked} onGo={go} />
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
