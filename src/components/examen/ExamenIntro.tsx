import { DURACION_MS, EXAMEN, TOTAL_PREGUNTAS } from '../../lib/examen'
import { Button } from '../ui/Button'

const CARD = 'rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-brand-50 px-4 py-5 text-center dark:bg-brand-900/30">
      <p className="text-3xl font-semibold text-brand-700 dark:text-brand-100">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  )
}

/** Pantalla de inicio: aclara el alcance de la prueba y sus reglas antes de comenzar */
export function ExamenIntro({ vacanteTitulo, onStart }: { vacanteTitulo: string | null; onStart: () => void }) {
  return (
    <div className={`${CARD} animate-fade-in overflow-hidden`}>
      <div className="bg-gradient-to-r from-brand-700 to-brand-500 px-6 py-8 text-white sm:px-10">
        <p className="text-xs font-semibold tracking-wide uppercase opacity-80">
          {vacanteTitulo ? `Postulación: ${vacanteTitulo}` : 'Postulación'}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{EXAMEN.titulo}</h1>
      </div>

      <div className="space-y-6 px-6 py-8 sm:px-10">
        <div className="grid gap-3 sm:grid-cols-3">
          <Fact value={String(TOTAL_PREGUNTAS)} label="Preguntas" />
          <Fact value={`${DURACION_MS / 60_000} min`} label="Tiempo total" />
          <Fact value="1" label="Único intento" />
        </div>

        <p className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:border-brand-900/60 dark:bg-brand-900/30 dark:text-brand-100">
          {EXAMEN.introduccion}
        </p>

        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
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
