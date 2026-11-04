import { useId, type TextareaHTMLAttributes } from 'react'
import { LABEL_CLASS, fieldClass, messageClass } from './fieldStyles'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, id, className = '', rows = 5, ...props }: TextareaProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const messageId = `${fieldId}-message`
  const message = error ?? hint

  return (
    <div className={className}>
      <label htmlFor={fieldId} className={LABEL_CLASS}>
        {label}
      </label>
      <textarea
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={`${fieldClass(Boolean(error))} resize-y`}
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
