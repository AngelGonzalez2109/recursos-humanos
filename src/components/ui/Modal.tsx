import { useEffect, useId, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  size?: 'md' | 'lg'
}

export function Modal({ open, title, onClose, children, size = 'lg' }: ModalProps) {
  const titleId = useId()

  // Cerrar con Escape y bloquear el scroll del fondo
  useEffect(() => {
    if (!open) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-bistre/55 p-4 backdrop-blur-sm animate-overlay-in sm:items-start sm:py-12">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`surface h-fit w-full animate-modal-in border-solid border-bistre/30 bg-slate-50 dark:border-white/25 dark:bg-slate-900 ${size === 'md' ? 'max-w-md' : 'max-w-2xl'}`}
      >
        <div className="hairline-b flex items-center justify-between px-6 py-4">
          <h2 id={titleId} className="text-2xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="cursor-pointer rounded-full p-2 text-slate-600 transition-colors hover:bg-bistre/[0.06] hover:text-bistre dark:text-slate-400 dark:hover:bg-cream/10 dark:hover:text-cream"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
