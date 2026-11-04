import { useId, type SelectHTMLAttributes } from 'react'
import { LABEL_CLASS, fieldClass, messageClass } from './fieldStyles'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
}

export function Select({ label, options, error, id, className = '', ...props }: SelectProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const messageId = `${fieldId}-message`

  return (
    <div className={className}>
      <label htmlFor={fieldId} className={LABEL_CLASS}>
        {label}
      </label>
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? messageId : undefined}
        className={`${fieldClass(Boolean(error))} cursor-pointer`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={messageId} className={messageClass(true)}>
          {error}
        </p>
      )}
    </div>
  )
}
