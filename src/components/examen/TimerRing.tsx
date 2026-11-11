import { formatMmSs } from '../../lib/examen'

const SIZE = 88
const STROKE = 7
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** Urgente: último 10 % del tiempo (máx. 1 min). Aviso: último 25 % */
const esUrgente = (remainingMs: number, totalMs: number) => remainingMs <= Math.min(60_000, totalMs * 0.1)

function colorFor(remainingMs: number, totalMs: number): string {
  if (esUrgente(remainingMs, totalMs)) return 'stroke-red-500 text-red-600 dark:text-red-400'
  if (remainingMs <= totalMs * 0.25) return 'stroke-amber-500 text-amber-600 dark:text-amber-400'
  return 'stroke-brand-600 text-slate-900 dark:text-slate-100'
}

/** Rueda de progreso con el tiempo restante en el centro */
export function TimerRing({ remainingMs, totalMs }: { remainingMs: number; totalMs: number }) {
  const fraction = Math.min(1, remainingMs / totalMs)
  const color = colorFor(remainingMs, totalMs)

  return (
    <div
      role="timer"
      aria-label={`Tiempo restante ${formatMmSs(remainingMs)}`}
      className={`relative shrink-0 ${esUrgente(remainingMs, totalMs) ? 'animate-pulse' : ''}`}
      style={{ width: SIZE, height: SIZE }}
    >
      <svg width={SIZE} height={SIZE} className="-rotate-90" aria-hidden="true">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          className="stroke-slate-200 dark:stroke-slate-800"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
          className={`transition-[stroke-dashoffset,stroke] duration-500 ease-linear ${color.split(' ')[0]}`}
        />
      </svg>
      <span
        className={`absolute inset-0 flex flex-col items-center justify-center font-mono text-lg tabular-nums ${color
          .split(' ')
          .slice(1)
          .join(' ')}`}
      >
        {formatMmSs(remainingMs)}
        <span className="text-[10px] tracking-[0.1em] text-slate-600 uppercase dark:text-slate-400">restante</span>
      </span>
    </div>
  )
}
