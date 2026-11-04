import { useId, type InputHTMLAttributes } from 'react'
import { LABEL_CLASS, fieldClass, messageClass } from './fieldStyles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, id, className = '', ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const message = error ?? hint

  return (
    <div className={className}>
      <label htmlFor={inputId} className={LABEL_CLASS}>
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={fieldClass(Boolean(error))}
        {...props}
      />
      {message && (
        <p id={messageId} className={messageClass(Boolean(error))}>
          {message}
        </p>
      )}
    </div>
  )
}
