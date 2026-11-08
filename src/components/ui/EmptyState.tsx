import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="surface animate-fade-in px-6 py-14 text-center">
      <h2 className="text-xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
