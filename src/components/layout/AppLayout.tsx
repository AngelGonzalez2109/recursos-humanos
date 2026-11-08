import type { ReactNode } from 'react'
import { AppHeader } from './AppHeader'
import { DevCredits } from './DevCredits'

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
      <main className="mx-auto max-w-6xl animate-fade-in px-4 pt-14 pb-16 sm:px-6">
        {title && (
          <div className="hairline-b mb-12 flex flex-col gap-6 pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {eyebrow && <p className="eyebrow mb-4 animate-rise">{eyebrow}</p>}
              <h1 className="animate-rise text-4xl leading-[1.1] [animation-delay:80ms] sm:text-5xl">{title}</h1>
              {description && (
                <p className="mt-4 max-w-xl animate-rise text-lg leading-relaxed text-slate-600 [animation-delay:160ms] dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="shrink-0 animate-rise [animation-delay:240ms]">{actions}</div>}
          </div>
        )}
        {children}
      </main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <DevCredits className="hairline-t pt-6" />
      </footer>
    </div>
  )
}
