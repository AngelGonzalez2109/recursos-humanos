import { useSesionExamen } from '../../hooks/useSesionExamen'
import { LoadError } from '../vacantes/LoadError'
import { ExamenEnCurso } from './ExamenEnCurso'
import { ExamenIntro } from './ExamenIntro'

interface ExamenRunnerProps {
  postulacionId: string
  userId: string
  vacanteTitulo: string | null
  /** Áreas que el reclutador eligió para la vacante */
  areas: string[]
  onDone: () => void
}

/** Pantalla de inicio hasta que el examen comienza (lo asigna el servidor); luego, el examen en curso */
export function ExamenRunner({ postulacionId, userId, vacanteTitulo, areas, onDone }: ExamenRunnerProps) {
  const { sesion, loading, error, reload, iniciar, iniciando, errorInicio } = useSesionExamen(postulacionId)

  if (loading) {
    return <div className="h-64 animate-pulse rounded-sm bg-slate-200 dark:bg-slate-800" aria-busy="true" />
  }
  if (error) return <LoadError message={error} onRetry={reload} />

  if (!sesion) {
    return (
      <ExamenIntro
        vacanteTitulo={vacanteTitulo}
        areas={areas}
        starting={iniciando}
        error={errorInicio}
        onStart={() => void iniciar()}
      />
    )
  }

  return <ExamenEnCurso sesion={sesion} postulacionId={postulacionId} userId={userId} onDone={onDone} />
}
