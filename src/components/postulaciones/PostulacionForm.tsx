import { useState, type ChangeEvent, type FormEvent } from 'react'
import { getDbErrorMessage } from '../../lib/dbErrors'
import { EDAD_MAX, EDAD_MIN } from '../../lib/perfilOptions'
import { validatePerfilCandidato, type PostulacionFieldErrors } from '../../lib/postulacionValidation'
import { MENSAJE_MAX, postular, validateCv } from '../../lib/postulacionesService'
import type { PerfilFormValues } from '../../types/perfil'
import type { Postulacion, PostulacionFormValues } from '../../types/postulacion'
import { PerfilFields } from '../perfil/PerfilFields'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
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

const INITIAL_VALUES: PostulacionFormValues = {
  edad: '',
  nivelEstudios: '',
  gradoAcademico: '',
  experienciaAnios: '',
  habilidades: [],
  mensaje: '',
}

export function PostulacionForm({ vacanteId, userId, onSent, onCancel }: PostulacionFormProps) {
  const [values, setValues] = useState<PostulacionFormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<PostulacionFieldErrors>({})
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | undefined>()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const setField = <K extends keyof PostulacionFormValues>(field: K, value: PostulacionFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const setPerfil = <K extends keyof PerfilFormValues>(field: K, value: PerfilFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null)
    setFileError(undefined)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validation = validatePerfilCandidato(values)
    const cvProblem = validateCv(file)
    setErrors(validation)
    setFileError(cvProblem)
    if (cvProblem || !file || Object.keys(validation).length > 0) {
      setSubmitError('Revisa los campos marcados.')
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      onSent(await postular(vacanteId, userId, file, values))
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

      <fieldset className="space-y-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
        <legend className="px-2 text-sm font-semibold">Tu perfil (para calcular tu compatibilidad)</legend>
        <Input
          label="Edad"
          type="number"
          inputMode="numeric"
          min={EDAD_MIN}
          max={EDAD_MAX}
          value={values.edad}
          error={errors.edad}
          onChange={(e) => setField('edad', e.target.value)}
        />
        <PerfilFields
          mode="candidato"
          values={values}
          errors={errors}
          onChange={setPerfil}
        />
      </fieldset>

      <Textarea
        label="Mensaje para el reclutador (opcional)"
        rows={3}
        maxLength={MENSAJE_MAX}
        value={values.mensaje}
        onChange={(event) => setField('mensaje', event.target.value)}
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
