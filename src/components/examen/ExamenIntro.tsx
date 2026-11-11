import { EXAMEN } from '../../lib/examen'
import {
  CATALOGO,
  MINUTOS_POR_AREA,
  PREGUNTAS_POR_AREA,
  areaPorId,
  ordenarAreas,
  totalMinutos,
  totalPreguntas,
} from '../../lib/examenAreas'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div className="inset-panel px-4 py-6 text-center">
      <p className="font-display text-4xl leading-none text-slate-900 tabular-nums dark:text-slate-100">{value}</p>
      <p className="eyebrow mt-3">{label}</p>
    </div>
  )
}

interface ExamenIntroProps {
  vacanteTitulo: string | null
  /** Áreas que definió el reclutador para esta vacante */
  areas: string[]
  starting: boolean
  error: string | null
  onStart: () => void
}

/** Pantalla de inicio: aclara el alcance de la prueba y sus reglas antes de comenzar */
export function ExamenIntro({ vacanteTitulo, areas, starting, error, onStart }: ExamenIntroProps) {
  const ids = ordenarAreas(areas)

  return (
    <div className="surface animate-fade-in overflow-hidden">
      <div className="hairline-b px-6 py-10 sm:px-10">
        <p className="eyebrow">{vacanteTitulo ? `Postulación: ${vacanteTitulo}` : 'Postulación'}</p>
        <h1 className="mt-4 text-3xl leading-[1.15] sm:text-4xl">{CATALOGO.titulo}</h1>
      </div>

      <div className="space-y-6 px-6 py-8 sm:px-10">
        {ids.length === 0 ? (
          <Alert variant="info">
            El reclutador aún no definió las áreas de esta evaluación. Vuelve a intentarlo más tarde.
          </Alert>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <Fact value={String(totalPreguntas(ids.length))} label="Preguntas" />
              <Fact value={`${totalMinutos(ids.length)} min`} label="Tiempo total" />
              <Fact value="1" label="Único intento" />
            </div>

            <div>
              <p className="eyebrow mb-2">
                {ids.length === 1 ? 'Área a evaluar' : 'Áreas a evaluar'} · {PREGUNTAS_POR_AREA} preguntas y{' '}
                {MINUTOS_POR_AREA} min por área
              </p>
              <ul className="list-hairline text-sm text-slate-800 dark:text-slate-200">
                {ids.map((id) => (
                  <li key={id} className="py-2">
                    {areaPorId(id)?.nombre}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <p className="rounded-sm border border-dashed border-bistre/25 bg-bone px-4 py-3 text-sm text-slate-800 dark:border-white/20 dark:bg-white/[0.06] dark:text-slate-200">
          {EXAMEN.introduccion}
        </p>

        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>• Las preguntas de cada área se eligen al azar al comenzar.</li>
          <li>• El tiempo comienza al presionar «Comenzar» y no se detiene, aunque recargues o salgas de la página.</li>
          <li>• Si recargas por accidente, tus respuestas se conservan en este navegador.</li>
          <li>• Al terminarse el tiempo, la evaluación se envía automáticamente con lo que hayas respondido.</li>
          <li>• Solo puedes presentarla una vez y no verás tu puntaje; el reclutador recibirá el resultado.</li>
        </ul>

        {error && <Alert variant="error">{error}</Alert>}

        {ids.length > 0 && (
          <Button onClick={onStart} loading={starting} className="w-full sm:w-auto">
            Comenzar evaluación
          </Button>
        )}
      </div>
    </div>
  )
}
