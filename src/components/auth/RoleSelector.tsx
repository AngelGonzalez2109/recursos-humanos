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
      <legend className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">
        Tipo de cuenta
      </legend>
      <div className="grid grid-cols-2 gap-3">
        {ROLE_OPTIONS.map((option) => {
          const selected = option.value === value
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-sm border p-3 transition-[background-color,border-color] duration-200 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-bistre dark:has-focus-visible:outline-cream ${
                selected
                  ? 'border-bistre bg-bone ring-1 ring-bistre dark:border-cream dark:bg-white/10 dark:ring-cream'
                  : 'border-slate-400 hover:border-bistre/70 hover:bg-bistre/[0.04] dark:border-slate-600 dark:hover:border-cream/60 dark:hover:bg-white/5'
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
                  'text-slate-900 dark:text-slate-100'
                }`}
              >
                {option.title}
              </span>
              <span className="mt-0.5 block text-xs text-slate-600 dark:text-slate-400">
                {option.description}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
