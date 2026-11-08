import { useEffect, useRef, useState } from 'react'

const REDUCED = '(prefers-reduced-motion: reduce)'

interface CountUpProps {
  value: number
  /** Duración en ms */
  duration?: number
}

/** Cifra que cuenta desde su valor anterior (o 0) hasta `value`; sin movimiento si se pidió reducirlo */
export function CountUp({ value, duration = 800 }: CountUpProps) {
  const reduced = typeof window !== 'undefined' && window.matchMedia(REDUCED).matches
  const [shown, setShown] = useState(0)
  const current = useRef(0)

  useEffect(() => {
    if (reduced) return
    const from = current.current
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      current.current = from + (value - from) * eased
      setShown(Math.round(current.current))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration, reduced])

  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">{reduced ? value : shown}</span>
    </>
  )
}
