import { useId, useState, type KeyboardEvent } from 'react'
import { HABILIDAD_MAX_LEN, HABILIDAD_MIN_LEN } from '../../lib/perfilOptions'
import { normalize } from '../../lib/vacanteFormat'
import { LABEL_CLASS, fieldClass, messageClass } from './fieldStyles'

interface TagInputProps {
  label: string
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  max: number
  hint?: string
}

const CHIP = 'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors duration-200'

/** Etiquetas libres con sugerencias: Enter o coma para agregar, clic en × para quitar */
export function TagInput({ label, value, onChange, suggestions = [], max, hint }: TagInputProps) {
  const id = useId()
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)

  const has = (tag: string) => value.some((t) => normalize(t) === normalize(tag))

  function add(raw: string) {
    const tag = raw.trim().replace(/\s+/g, ' ')
    if (!tag) return
    if (tag.length < HABILIDAD_MIN_LEN || tag.length > HABILIDAD_MAX_LEN) {
      setError(`Cada etiqueta debe tener entre ${HABILIDAD_MIN_LEN} y ${HABILIDAD_MAX_LEN} caracteres.`)
      return
    }
    if (has(tag)) {
      setDraft('')
      setError(null)
      return
    }
    if (value.length >= max) {
      setError(`Máximo ${max} etiquetas.`)
      return
    }
    onChange([...value, tag])
    setDraft('')
    setError(null)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      add(draft)
    } else if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const available = suggestions.filter((s) => !has(s))

  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      {value.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <li key={tag} className={`${CHIP} bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-100`}>
              {tag}
              <button
                type="button"
                aria-label={`Quitar ${tag}`}
                onClick={() => onChange(value.filter((t) => t !== tag))}
                className="cursor-pointer rounded px-0.5 hover:bg-brand-100 dark:hover:bg-brand-900"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        id={id}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => add(draft)}
        placeholder="Escribe y presiona Enter"
        aria-invalid={error ? true : undefined}
        className={fieldClass(Boolean(error))}
      />
      <p className={messageClass(Boolean(error))}>{error ?? hint}</p>
      {available.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Sugerencias">
          {available.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className={`${CHIP} cursor-pointer border border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800`}
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
