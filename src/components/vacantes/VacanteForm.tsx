import { useState, type ChangeEvent, type FormEvent } from 'react'
import { createVacante } from '../../lib/vacantesService'
import { validateVacante } from '../../lib/vacanteValidation'
import { getDbErrorMessage } from '../../lib/dbErrors'
import { MODALIDAD_LABELS, MONEDAS, TIPO_CONTRATO_LABELS } from '../../lib/vacanteFormat'
import type { Vacante, VacanteFieldErrors, VacanteFormValues } from '../../types/vacante'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }))

const MODALIDAD_OPTIONS = toOptions(MODALIDAD_LABELS)
const TIPO_OPTIONS = toOptions(TIPO_CONTRATO_LABELS)
const MONEDA_OPTIONS = MONEDAS.map((m) => ({ value: m, label: m }))

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

interface VacanteFormProps {
  defaultEmpresa: string
  onCreated: (vacante: Vacante) => void
  onCancel: () => void
}

export function VacanteForm({ defaultEmpresa, onCreated, onCancel }: VacanteFormProps) {
  const [values, setValues] = useState<VacanteFormValues>({
    titulo: '',
    empresa: defaultEmpresa,
    ubicacion: '',
    modalidad: 'presencial',
    tipoContrato: 'tiempo_completo',
    descripcion: '',
    requisitos: '',
    salarioMin: '',
    salarioMax: '',
    moneda: 'MXN',
  })
  const [errors, setErrors] = useState<VacanteFieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const bind = (field: keyof VacanteFormValues) => ({
    value: values[field],
    error: errors[field],
    onChange: (event: ChangeEvent<FieldElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    },
  })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validation = validateVacante(values)
    setErrors(validation)
    if (Object.keys(validation).length > 0) {
      setSubmitError('Revisa los campos marcados.')
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      onCreated(await createVacante(values))
    } catch (error) {
      console.error('Error al publicar la vacante:', error)
      setSubmitError(getDbErrorMessage(error))
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {submitError && <Alert variant="error">{submitError}</Alert>}

      <Input label="Título del puesto" placeholder="Ej. Analista de Recursos Humanos" {...bind('titulo')} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Empresa" autoComplete="organization" {...bind('empresa')} />
        <Input label="Ubicación" placeholder="Ej. Monterrey, N.L." {...bind('ubicacion')} />
        <Select label="Modalidad" options={MODALIDAD_OPTIONS} {...bind('modalidad')} />
        <Select label="Tipo de contrato" options={TIPO_OPTIONS} {...bind('tipoContrato')} />
      </div>

      <Textarea
        label="Descripción del puesto"
        hint="Responsabilidades, horario, beneficios… (mínimo 20 caracteres)"
        rows={5}
        {...bind('descripcion')}
      />
      <Textarea
        label="Requisitos"
        hint="Escribe un requisito por línea."
        rows={4}
        {...bind('requisitos')}
      />

      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_7rem]">
        <Input label="Salario mínimo (mensual)" inputMode="decimal" placeholder="Opcional" {...bind('salarioMin')} />
        <Input label="Salario máximo (mensual)" inputMode="decimal" placeholder="Opcional" {...bind('salarioMax')} />
        <Select label="Moneda" options={MONEDA_OPTIONS} {...bind('moneda')} />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" loading={submitting}>
          Publicar vacante
        </Button>
      </div>
    </form>
  )
}
