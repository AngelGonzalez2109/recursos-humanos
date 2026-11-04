import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="animate-fade-in rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
