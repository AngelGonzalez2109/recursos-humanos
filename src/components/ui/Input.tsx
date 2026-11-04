import { useId, type InputHTMLAttributes } from 'react'

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
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={`block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors duration-200 placeholder:text-slate-400 focus:ring-2 focus:outline-none dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/70'
            : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-700 dark:focus:border-brand-500 dark:focus:ring-brand-500/30'
        }`}
        {...props}
      />
      {message && (
        <p
          id={messageId}
          className={`mt-1.5 text-xs ${error ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
