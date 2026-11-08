import type { ReactNode } from 'react'
import { BrandLogo } from '../ui/BrandLogo'
import { ThemeToggle } from '../ui/ThemeToggle'
import { DevCredits } from '../layout/DevCredits'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-10 flex justify-center">
          <BrandLogo />
        </div>
        <div className="surface p-6 sm:p-10">
          <p className="eyebrow mb-4">Acceso</p>
          <h1 className="text-4xl leading-none">{title}</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
          <div className="hairline-t mt-8 pt-8">{children}</div>
        </div>
        {footer && <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">{footer}</p>}
      </div>
      <DevCredits className="mt-16" />
    </main>
  )
}
