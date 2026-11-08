/** Colores de la compatibilidad según el porcentaje (texto y relleno de la barra) */
export function matchTone(porcentaje: number) {
  if (porcentaje >= 75) {
    return { text: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-600 dark:bg-emerald-400' }
  }
  if (porcentaje >= 50) {
    return { text: 'text-slate-900 dark:text-slate-100', bar: 'bg-bistre dark:bg-cream' }
  }
  return { text: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500 dark:bg-amber-400' }
}
