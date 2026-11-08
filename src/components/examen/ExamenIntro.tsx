import { DURACION_MS, EXAMEN, TOTAL_PREGUNTAS } from '../../lib/examen'
import { Button } from '../ui/Button'

const CARD = 'surface'

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div className="inset-panel px-4 py-6 text-center">
      <p className="font-display text-4xl leading-none text-slate-900 tabular-nums dark:text-slate-100">{value}</p>
      <p className="eyebrow mt-3">{label}</p>
    </div>
  )
}

/** Pantalla de inicio: aclara el alcance de la prueba y sus reglas antes de comenzar */
export function ExamenIntro({ vacanteTitulo, onStart }: { vacanteTitulo: string | null; onStart: () => void }) {
  return (
    <div className={`${CARD} animate-fade-in overflow-hidden`}>
      <div className="hairline-b px-6 py-10 sm:px-10">
        <p className="eyebrow">{vacanteTitulo ? `Postulación: ${vacanteTitulo}` : 'Postulación'}</p>
        <h1 className="mt-4 text-3xl leading-[1.15] sm:text-4xl">{EXAMEN.titulo}</h1>
      </div>

      <div className="space-y-6 px-6 py-8 sm:px-10">
        <div className="grid gap-3 sm:grid-cols-3">
          <Fact value={String(TOTAL_PREGUNTAS)} label="Preguntas" />
          <Fact value={`${DURACION_MS / 60_000} min`} label="Tiempo total" />
          <Fact value="1" label="Único intento" />
        </div>

        <p className="rounded-sm border border-dashed border-bistre/25 bg-bone px-4 py-3 text-sm text-slate-800 dark:border-white/20 dark:bg-white/[0.06] dark:text-slate-200">
          {EXAMEN.introduccion}
        </p>

        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>• El tiempo comienza al presionar «Comenzar» y no se detiene, aunque recargues o salgas de la página.</li>
          <li>• Si recargas por accidente, tus respuestas se conservan en este navegador.</li>
          <li>• Al terminarse el tiempo, la evaluación se envía automáticamente con lo que hayas respondido.</li>
          <li>• Solo puedes presentarla una vez y no verás tu puntaje; el reclutador recibirá el resultado.</li>
        </ul>

        <Button onClick={onStart} className="w-full sm:w-auto">
          Comenzar evaluación
        </Button>
      </div>
    </div>
  )
}
