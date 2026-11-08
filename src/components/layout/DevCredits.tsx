/** Créditos discretos al pie de cada pantalla */
export function DevCredits({ className = '' }: { className?: string }) {
  return (
    <p className={`eyebrow text-center ${className}`}>
      Desarrollado por <span className="text-slate-800 dark:text-slate-200">Ángel González</span> y{' '}
      <span className="text-slate-800 dark:text-slate-200">María Marín</span>
    </p>
  )
}
