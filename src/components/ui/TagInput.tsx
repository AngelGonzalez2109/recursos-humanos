import { useId, useMemo, useState, type KeyboardEvent } from 'react'
import { normalize } from '../../lib/vacanteFormat'
import { LABEL_CLASS, fieldClass, messageClass } from './fieldStyles'

interface TagInputProps {
  label: string
  value: string[]
  onChange: (tags: string[]) => void
  /** Catálogo del que se puede elegir; no se aceptan etiquetas fuera de él */
  options: string[]
  max: number
  hint?: string
}

const MAX_RESULTS = 50

/** Primero las que empiezan con el texto; después las que lo contienen */
function filterOptions(options: string[], selected: string[], query: string): string[] {
  const taken = new Set(selected.map(normalize))
  const term = normalize(query.trim())
  const available = options.filter((o) => !taken.has(normalize(o)))
  if (!term) return available.slice(0, MAX_RESULTS)
  const starts: string[] = []
  const contains: string[] = []
  for (const option of available) {
    const text = normalize(option)
    if (text.startsWith(term)) starts.push(option)
    else if (text.includes(term)) contains.push(option)
  }
  return [...starts, ...contains].slice(0, MAX_RESULTS)
}

/** Autocompletado multi-selección: escribe, filtra el catálogo y elige con clic o teclado */
export function TagInput({ label, value, onChange, options, max, hint }: TagInputProps) {
  const id = useId()
  const listId = `${id}-list`
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const results = useMemo(() => filterOptions(options, value, query), [options, value, query])
  const full = value.length >= max
  const showList = open && !full

  function select(tag: string) {
    if (full) return
    onChange([...value, tag])
    setQuery('')
    setActive(0)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault() // evita enviar el formulario
      if (showList && results[active]) select(results[active])
    } else if (event.key === 'Escape') {
      setOpen(false)
    } else if (event.key === 'Backspace' && query === '' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="relative">
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      {value.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-100"
            >
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
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        disabled={full}
        value={query}
        placeholder={full ? `Máximo ${max} etiquetas` : 'Escribe para buscar… (ej. Excel)'}
        onChange={(event) => {
          setQuery(event.target.value)
          setActive(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={handleKeyDown}
        className={`${fieldClass(false)} disabled:cursor-not-allowed disabled:opacity-60`}
      />
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full animate-fade-in overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          {results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">Sin coincidencias</li>
          ) : (
            results.map((option, index) => (
              <li
                key={option}
                role="option"
                aria-selected={index === active}
                // mouseDown (no click) para elegir antes de que el input pierda el foco
                onMouseDown={(event) => {
                  event.preventDefault()
                  select(option)
                }}
                onMouseEnter={() => setActive(index)}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  index === active ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-100' : ''
                }`}
              >
                {option}
              </li>
            ))
          )}
        </ul>
      )}
      {hint && <p className={messageClass(false)}>{hint}</p>}
    </div>
  )
}
