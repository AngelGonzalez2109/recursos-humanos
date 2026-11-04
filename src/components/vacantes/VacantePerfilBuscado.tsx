import { GRADO_ACADEMICO_LABELS, NIVEL_ESTUDIOS_LABELS } from '../../lib/perfilOptions'
import type { Vacante } from '../../types/vacante'
import { Badge } from '../ui/Badge'

function edadTexto({ edad_min: min, edad_max: max }: Vacante): string | null {
  if (min !== null && max !== null) return `${min} a ${max} años`
  if (min !== null) return `Desde ${min} años`
  if (max !== null) return `Hasta ${max} años`
  return null
}

/** Requisitos estructurados de la vacante; no se muestra si no define ninguno */
export function VacantePerfilBuscado({ vacante }: { vacante: Vacante }) {
  const filas: [string, string][] = []
  const edad = edadTexto(vacante)
  if (edad) filas.push(['Edad', edad])
  if (vacante.nivel_estudios) filas.push(['Nivel de estudios', NIVEL_ESTUDIOS_LABELS[vacante.nivel_estudios]])
  if (vacante.grado_academico) filas.push(['Grado académico', GRADO_ACADEMICO_LABELS[vacante.grado_academico]])
  if (vacante.experiencia_anios !== null) {
    filas.push(['Experiencia', `${vacante.experiencia_anios} ${vacante.experiencia_anios === 1 ? 'año' : 'años'}`])
  }
  if (filas.length === 0 && vacante.habilidades.length === 0) return null

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-semibold">Perfil buscado</h2>
      <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
        {filas.map(([label, value]) => (
          <div key={label}>
            <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      {vacante.habilidades.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {vacante.habilidades.map((h) => (
            <Badge key={h} variant="brand">
              {h}
            </Badge>
          ))}
        </div>
      )}
    </section>
  )
}
