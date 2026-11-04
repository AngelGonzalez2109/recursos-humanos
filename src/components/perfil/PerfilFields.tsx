import {
  EXPERIENCIA_MAX,
  GRADO_ACADEMICO_LABELS,
  HABILIDADES_MAX,
  HABILIDADES_CATALOGO,
  NIVEL_ESTUDIOS_LABELS,
  toOptions,
} from '../../lib/perfilOptions'
import type { PerfilFormValues } from '../../types/perfil'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { TagInput } from '../ui/TagInput'

type PerfilErrors = Partial<Record<keyof PerfilFormValues, string>>

interface PerfilFieldsProps {
  /** requisito: el reclutador define lo que pide; candidato: el postulante declara lo que tiene */
  mode: 'requisito' | 'candidato'
  values: PerfilFormValues
  errors: PerfilErrors
  onChange: <K extends keyof PerfilFormValues>(field: K, value: PerfilFormValues[K]) => void
}

/** Campos estructurados compartidos por el formulario de vacante y el de postulación */
export function PerfilFields({ mode, values, errors, onChange }: PerfilFieldsProps) {
  const req = mode === 'requisito'
  const empty = req ? 'Sin requisito' : undefined

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label={req ? 'Nivel de estudios requerido' : 'Nivel de estudios'}
          options={toOptions(NIVEL_ESTUDIOS_LABELS, empty ?? 'Selecciona…')}
          value={values.nivelEstudios}
          error={errors.nivelEstudios}
          onChange={(e) => onChange('nivelEstudios', e.target.value as PerfilFormValues['nivelEstudios'])}
        />
        <Select
          label={req ? 'Grado académico requerido' : 'Grado académico'}
          options={toOptions(GRADO_ACADEMICO_LABELS, req ? 'Sin requisito' : 'Ninguno')}
          value={values.gradoAcademico}
          error={errors.gradoAcademico}
          onChange={(e) => onChange('gradoAcademico', e.target.value as PerfilFormValues['gradoAcademico'])}
        />
        <Input
          label={req ? 'Años de experiencia requeridos' : 'Años de experiencia'}
          type="number"
          inputMode="numeric"
          min={0}
          max={EXPERIENCIA_MAX}
          placeholder={req ? 'Opcional' : '0'}
          value={values.experienciaAnios}
          error={errors.experienciaAnios}
          onChange={(e) => onChange('experienciaAnios', e.target.value)}
        />
      </div>
      <TagInput
        label={req ? 'Habilidades clave e idiomas requeridos' : 'Tus habilidades e idiomas'}
        hint={req ? 'Cada habilidad que el candidato tenga suma 2% a su compatibilidad.' : 'Escribe y elige de la lista las que dominas.'}
        value={values.habilidades}
        onChange={(tags) => onChange('habilidades', tags)}
        options={HABILIDADES_CATALOGO}
        max={HABILIDADES_MAX}
      />
    </div>
  )
}
