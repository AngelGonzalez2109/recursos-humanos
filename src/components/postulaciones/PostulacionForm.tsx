import { useState, type ChangeEvent, type FormEvent } from 'react'
import { getDbErrorMessage } from '../../lib/dbErrors'
import { MENSAJE_MAX, postular, validateCv } from '../../lib/postulacionesService'
import type { Postulacion } from '../../types/postulacion'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Textarea'

interface PostulacionFormProps {
  vacanteId: string
  userId: string
  onSent: (postulacion: Postulacion) => void
  onCancel: () => void
}

function getErrorMessage(error: unknown): string {
  const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : ''
  if (code === '23505') return 'Ya te postulaste a esta vacante.'
  if (error && typeof error === 'object' && 'statusCode' in error) {
    return 'No se pudo subir tu CV. Verifica que sea un PDF de máximo 5 MB e inténtalo de nuevo.'
  }
  return getDbErrorMessage(error)
}

export function PostulacionForm({ vacanteId, userId, onSent, onCancel }: PostulacionFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [fileError, setFileError] = useState<string | undefined>()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null)
    setFileError(undefined)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const problem = validateCv(file)
    setFileError(problem)
    if (problem || !file) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      onSent(await postular(vacanteId, userId, file, mensaje))
    } catch (error) {
      console.error('Error al enviar la postulación:', error)
      setSubmitError(getErrorMessage(error))
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {submitError && <Alert variant="error">{submitError}</Alert>}

      <div>
        <label htmlFor="cv-file" className="mb-1.5 block text-sm font-medium">
          Currículum (PDF, máx. 5 MB)
        </label>
        <input
          id="cv-file"
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFile}
          aria-invalid={fileError ? true : undefined}
          className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-slate-600 file:mr-4 file:cursor-pointer file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:file:bg-slate-800 dark:file:text-slate-200"
        />
        {fileError && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{fileError}</p>}
      </div>

      <Textarea
        label="Mensaje para el reclutador (opcional)"
        rows={4}
        maxLength={MENSAJE_MAX}
        value={mensaje}
        onChange={(event) => setMensaje(event.target.value)}
      />

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" loading={submitting}>
          Enviar postulación
        </Button>
      </div>
    </form>
  )
}
