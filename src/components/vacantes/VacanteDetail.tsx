import { formatFechaRelativa, formatSalario } from '../../lib/vacanteFormat'
import type { UserRole } from '../../types/database'
import type { Vacante } from '../../types/vacante'
import { PostulacionesRecibidas } from '../postulaciones/PostulacionesRecibidas'
import { PostularPanel } from '../postulaciones/PostularPanel'
import { Alert } from '../ui/Alert'
import { VacanteBadges } from './VacanteBadges'

const CARD = 'rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'

function Section({ title, text }: { title: string; text: string }) {
  return (
    <section className={CARD}>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">{text}</p>
    </section>
  )
}

interface VacanteDetailProps {
  vacante: Vacante
  viewerRole: UserRole
  isOwner: boolean
}

export function VacanteDetail({ vacante, viewerRole, isOwner }: VacanteDetailProps) {
  const cerrada = vacante.estado === 'cerrada'

  return (
    <div className="grid animate-fade-in gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <header className={CARD}>
          <h1 className="text-2xl font-semibold tracking-tight">{vacante.titulo}</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            {vacante.empresa} · {vacante.ubicacion}
          </p>
          <div className="mt-4">
            <VacanteBadges vacante={vacante} />
          </div>
        </header>
        <Section title="Descripción del puesto" text={vacante.descripcion} />
        <Section title="Requisitos" text={vacante.requisitos} />
        {isOwner && <PostulacionesRecibidas vacanteId={vacante.id} />}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className={CARD}>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Salario</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">{formatSalario(vacante)}</dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Publicada</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {formatFechaRelativa(vacante.created_at)}
              </dd>
            </div>
          </dl>
          {viewerRole === 'postulante' && !cerrada && <PostularPanel vacanteId={vacante.id} />}
        </div>
        {cerrada && (
          <Alert variant="info">
            {isOwner
              ? 'Esta vacante está cerrada y no aparece en el feed de candidatos.'
              : 'Esta vacante ya no recibe postulaciones.'}
          </Alert>
        )}
      </aside>
    </div>
  )
}
