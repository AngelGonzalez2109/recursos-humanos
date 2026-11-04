import type { UserRole } from '../../types/database'

const ROLE_OPTIONS: { value: UserRole; title: string; description: string }[] = [
  { value: 'postulante', title: 'Busco empleo', description: 'Explora vacantes y postúlate con tu CV.' },
  { value: 'publicador', title: 'Soy reclutador', description: 'Publica vacantes y recibe candidatos.' },
]

interface RoleSelectorProps {
  value: UserRole
  onChange: (role: UserRole) => void
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Tipo de cuenta
      </legend>
      <div className="grid grid-cols-2 gap-3">
        {ROLE_OPTIONS.map((option) => {
          const selected = option.value === value
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-lg border p-3 transition-all duration-200 has-focus-visible:ring-2 has-focus-visible:ring-brand-500/40 ${
                selected
                  ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500 dark:bg-brand-900/30'
                  : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                className={`block text-sm font-medium ${
                  selected ? 'text-brand-700 dark:text-brand-100' : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {option.title}
              </span>
              <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                {option.description}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
