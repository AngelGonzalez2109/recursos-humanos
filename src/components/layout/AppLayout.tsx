import type { ReactNode } from 'react'
import { AppHeader } from './AppHeader'

interface AppLayoutProps {
  title: string
  description: string
  children: ReactNode
}

export function AppLayout({ title, description, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl animate-fade-in px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  )
}
