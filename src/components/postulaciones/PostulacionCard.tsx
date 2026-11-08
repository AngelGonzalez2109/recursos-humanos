import { useId } from 'react'
import type { PostulacionConMatch } from '../../lib/match'
import type { ResultadoPsicometrico } from '../../types/examen'
import { ESTADO_POSTULACION_LABELS, ESTADO_POSTULACION_VARIANT } from '../../lib/postulacionEstados'
import { formatFechaRelativa } from '../../lib/vacanteFormat'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { PostulacionDetalle } from './PostulacionDetalle'
import { matchTone } from './matchTone'

interface PostulacionCardProps {
  item: PostulacionConMatch
  resultado?: ResultadoPsicometrico
  open: boolean
  onToggle: () => void
  onChanged: () => void
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`h-5 w-5 shrink-0 text-slate-600 transition-transform duration-300 dark:text-slate-400 ${open ? 'rotate-180' : ''}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

/** Candidato desplegable: la cabecera resume (nombre, estado, compatibilidad) y el detalle se abre al pulsarla */
export function PostulacionCard({ item, resultado, open, onToggle, onChanged }: PostulacionCardProps) {
  const panelId = useId()
  const { postulacion, match } = item
  const nombre = postulacion.postulante_nombre || 'Candidato'
  const pideExamen = postulacion.estado === 'pruebas_psicometricas'
  const tone = match.porcentaje === null ? null : matchTone(match.porcentaje)

  return (
    <li className="surface animate-fade-in overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center gap-4 p-5 text-left transition-colors hover:bg-bone/70 sm:p-6 dark:hover:bg-white/[0.03]"
      >
        <Avatar name={nombre} />
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-serif text-2xl leading-tight text-slate-900 dark:text-slate-100">{nombre}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <Badge variant={ESTADO_POSTULACION_VARIANT[postulacion.estado]}>
              {ESTADO_POSTULACION_LABELS[postulacion.estado]}
            </Badge>
            {resultado && <Badge variant="success">Evaluación completada</Badge>}
            {!resultado && pideExamen && <Badge variant="muted">Evaluación pendiente</Badge>}
            <span className="eyebrow">Se postuló {formatFechaRelativa(postulacion.created_at)}</span>
          </div>
        </div>
        <div className="w-20 shrink-0 text-right sm:w-28">
          {match.porcentaje !== null && tone ? (
            <>
              <p className={`font-serif text-4xl leading-none tabular-nums ${tone.text}`}>
                {match.porcentaje}
                <span className="text-xl">%</span>
              </p>
              <div className="mt-2">
                <ProgressBar
                  value={match.porcentaje}
                  label="Compatibilidad con la vacante"
                  barClassName={tone.bar}
                  heightClassName="h-1.5"
                />
              </div>
            </>
          ) : (
            <p className="eyebrow">Sin match</p>
          )}
        </div>
        <Chevron open={open} />
      </button>

      {open && <PostulacionDetalle id={panelId} item={item} resultado={resultado} onChanged={onChanged} />}
    </li>
  )
}
