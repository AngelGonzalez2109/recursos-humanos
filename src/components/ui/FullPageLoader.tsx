import { ThemeToggle } from './ThemeToggle'

/** Skeleton de pantalla completa mientras se resuelve la sesión */
export function FullPageLoader() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div
        role="status"
        className="surface w-full max-w-md animate-pulse space-y-4 p-8"
      >
        <span className="sr-only">Cargando…</span>
        <div className="h-6 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-4 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-10 w-full rounded-lg bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  )
}
