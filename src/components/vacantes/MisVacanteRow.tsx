import { useState } from 'react'
import { Link } from 'react-router-dom'
import { updateEstadoVacante } from '../../lib/vacantesService'
import { getDbErrorMessage } from '../../lib/dbErrors'
import { ESTADO_LABELS, formatFechaRelativa, formatSalario } from '../../lib/vacanteFormat'
import type { Vacante } from '../../types/vacante'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { VacanteBadges } from './VacanteBadges'

interface MisVacanteRowProps {
  vacante: Vacante
  onChanged: () => void
  onEdit: (vacante: Vacante) => void
}

export function MisVacanteRow({ vacante, onChanged, onEdit }: MisVacanteRowProps) {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abierta = vacante.estado === 'abierta'

  async function toggleEstado() {
    setUpdating(true)
    setError(null)
    try {
      await updateEstadoVacante(vacante.id, abierta ? 'cerrada' : 'abierta')
      onChanged()
    } catch (err) {
      console.error('Error al cambiar el estado:', err)
      setError(getDbErrorMessage(err))
    } finally {
      setUpdating(false)
    }
  }

  return (
    <li className="flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center dark:hover:bg-slate-800/50">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/vacantes/${vacante.id}`}
            className="truncate font-semibold text-slate-900 transition-colors hover:text-brand-600 dark:text-slate-100 dark:hover:text-brand-500"
          >
            {vacante.titulo}
          </Link>
          <Badge variant={abierta ? 'success' : 'muted'}>{ESTADO_LABELS[vacante.estado]}</Badge>
        </div>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          {vacante.ubicacion} · {formatSalario(vacante)} · Publicada {formatFechaRelativa(vacante.created_at)}
        </p>
        <div className="mt-2">
          <VacanteBadges vacante={vacante} />
        </div>
        {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="secondary" onClick={() => onEdit(vacante)}>
          Editar
        </Button>
        <Button variant="secondary" loading={updating} onClick={toggleEstado}>
          {abierta ? 'Cerrar vacante' : 'Reabrir'}
        </Button>
      </div>
    </li>
  )
}
