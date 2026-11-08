import { formatFechaRelativa, formatSalario } from '../../lib/vacanteFormat'
import type { UserRole } from '../../types/database'
import type { Vacante } from '../../types/vacante'
import { PostulacionesRecibidas } from '../postulaciones/PostulacionesRecibidas'
import { PostularPanel } from '../postulaciones/PostularPanel'
import { Alert } from '../ui/Alert'
import { Avatar } from '../ui/Avatar'
import { VacantePerfilBuscado } from './VacantePerfilBuscado'
import { VacanteBadges } from './VacanteBadges'

const CARD = 'surface p-6 sm:p-8'

function Section({ title, text }: { title: string; text: string }) {
  return (
    <section className={CARD}>
      <h2 className="text-2xl">{title}</h2>
      <p className="mt-4 max-w-prose text-base leading-relaxed whitespace-pre-line">{text}</p>
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
          <div className="flex items-start gap-4">
            <Avatar name={vacante.empresa} shape="square" />
            <div className="min-w-0">
              <h1 className="text-3xl leading-[1.15] sm:text-4xl">{vacante.titulo}</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {vacante.empresa} · {vacante.ubicacion}
              </p>
            </div>
          </div>
          <div className="mt-5">
            <VacanteBadges vacante={vacante} />
          </div>
        </header>
        <Section title="Descripción del puesto" text={vacante.descripcion} />
        <Section title="Requisitos" text={vacante.requisitos} />
        <VacantePerfilBuscado vacante={vacante} />
        {isOwner && <PostulacionesRecibidas vacante={vacante} />}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        <div className={CARD}>
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="eyebrow">Salario</dt>
              <dd className="mt-1 text-base font-medium text-slate-900 tabular-nums dark:text-slate-100">{formatSalario(vacante)}</dd>
            </div>
            <div>
              <dt className="eyebrow">Publicada</dt>
              <dd className="mt-1 text-base font-medium text-slate-900 dark:text-slate-100">
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
