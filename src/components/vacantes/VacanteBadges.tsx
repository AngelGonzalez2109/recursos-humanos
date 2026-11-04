import { MODALIDAD_LABELS, TIPO_CONTRATO_LABELS } from '../../lib/vacanteFormat'
import type { Vacante } from '../../types/vacante'
import { Badge } from '../ui/Badge'

export function VacanteBadges({ vacante }: { vacante: Vacante }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge variant="brand">{MODALIDAD_LABELS[vacante.modalidad]}</Badge>
      <Badge>{TIPO_CONTRATO_LABELS[vacante.tipo_contrato]}</Badge>
    </div>
  )
}
