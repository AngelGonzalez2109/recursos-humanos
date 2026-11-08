import type { ChangeEvent } from 'react'
import type { PerfilFormValues } from '../../types/perfil'
import type { VacanteFieldErrors, VacanteFormValues } from '../../types/vacante'
import { PerfilFields } from '../perfil/PerfilFields'
import { Input } from '../ui/Input'

interface VacantePerfilFieldsetProps {
  values: VacanteFormValues
  errors: VacanteFieldErrors
  onField: (field: 'edadMin' | 'edadMax') => (event: ChangeEvent<HTMLInputElement>) => void
  onPerfil: <K extends keyof PerfilFormValues>(field: K, value: PerfilFormValues[K]) => void
}

/** Bloque "Perfil buscado" del formulario de vacante (alimenta el match automático) */
export function VacantePerfilFieldset({ values, errors, onField, onPerfil }: VacantePerfilFieldsetProps) {
  return (
    <fieldset className="space-y-4 rounded-sm border border-dashed border-bistre/25 p-4 dark:border-white/20">
      <legend className="px-2 font-serif text-xl text-slate-900 dark:text-slate-100">Perfil buscado (para el match automático)</legend>
      <p className="text-xs text-slate-600 dark:text-slate-400">
        Todos son opcionales. Solo los que completes se usarán para calcular la compatibilidad de cada candidato.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Edad mínima"
          type="number"
          inputMode="numeric"
          min={16}
          max={99}
          placeholder="Opcional"
          value={values.edadMin}
          error={errors.edadMin}
          onChange={onField('edadMin')}
        />
        <Input
          label="Edad máxima"
          type="number"
          inputMode="numeric"
          min={16}
          max={99}
          placeholder="Opcional"
          value={values.edadMax}
          error={errors.edadMax}
          onChange={onField('edadMax')}
        />
      </div>
      <PerfilFields mode="requisito" values={values} errors={errors} onChange={onPerfil} />
    </fieldset>
  )
}
