import { useState } from 'react'
import { usePostulaciones } from '../../hooks/usePostulaciones'
import { getCvUrl } from '../../lib/postulacionesService'
import { formatFechaRelativa } from '../../lib/vacanteFormat'
import type { Postulacion } from '../../types/postulacion'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { LoadError } from '../vacantes/LoadError'

function PostulacionRow({ postulacion }: { postulacion: Postulacion }) {
  const [opening, setOpening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function openCv() {
    setOpening(true)
    setError(null)
    try {
      window.open(await getCvUrl(postulacion.cv_path), '_blank', 'noopener,noreferrer')
    } catch (err) {
      console.error('Error al abrir el CV:', err)
      setError('No se pudo abrir el CV. Inténtalo de nuevo.')
    } finally {
      setOpening(false)
    }
  }

  return (
    <li className="py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium">{postulacion.postulante_nombre || 'Candidato'}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Se postuló {formatFechaRelativa(postulacion.created_at)}
          </p>
        </div>
        <Button variant="secondary" onClick={openCv} loading={opening}>
          Ver CV
        </Button>
      </div>
      {postulacion.mensaje && (
        <p className="mt-2 text-sm whitespace-pre-line text-slate-600 dark:text-slate-300">{postulacion.mensaje}</p>
      )}
      {error && (
        <div className="mt-2">
          <Alert variant="error">{error}</Alert>
        </div>
      )}
    </li>
  )
}

/** Lista de candidatos de una vacante (solo su publicador) */
export function PostulacionesRecibidas({ vacanteId }: { vacanteId: string }) {
  const { data, loading, error, reload } = usePostulaciones(vacanteId)

  let content
  if (loading) content = <div className="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
  else if (error) content = <LoadError message={error} onRetry={reload} />
  else if (!data?.length) {
    content = <p className="text-sm text-slate-500 dark:text-slate-400">Aún no hay postulaciones.</p>
  } else {
    content = (
      <ul className="divide-y divide-slate-200 dark:divide-slate-800">
        {data.map((p) => (
          <PostulacionRow key={p.id} postulacion={p} />
        ))}
      </ul>
    )
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-base font-semibold">Postulaciones recibidas{data ? ` (${data.length})` : ''}</h2>
      {content}
    </section>
  )
}
