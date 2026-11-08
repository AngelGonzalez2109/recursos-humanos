import type { ReactNode } from 'react'
import { AppHeader } from './AppHeader'

interface AppLayoutProps {
  title?: string
  description?: string
  /** Marcador editorial sobre el título, p. ej. "01 · Vacantes" */
  eyebrow?: string
  /** Botones a la derecha del título (ej. "Publicar vacante") */
  actions?: ReactNode
  children: ReactNode
}

export function AppLayout({ title, description, eyebrow, actions, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl animate-fade-in px-4 pt-14 pb-24 sm:px-6">
        {title && (
          <div className="hairline-b mb-12 flex flex-col gap-6 pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
              <h1 className="text-[2.75rem] leading-[1.05] tracking-[-0.03em] sm:text-[3.375rem]">{title}</h1>
              {description && (
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
