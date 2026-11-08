/** Clases compartidas por Input, Textarea y Select */
export const LABEL_CLASS = 'mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200'

export function fieldClass(hasError: boolean): string {
  return `block w-full rounded-sm border bg-white px-3 py-2.5 text-sm text-slate-900 transition-[border-color,box-shadow] duration-200 placeholder:text-slate-400 hover:border-bistre/70 focus:ring-2 focus:outline-none dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-cream/60 ${
    hasError
      ? 'border-red-500 focus:border-red-600 focus:ring-red-500/25 dark:border-red-400/70'
      : 'border-slate-400 focus:border-bistre focus:ring-bistre/15 dark:border-slate-600 dark:focus:border-cream dark:focus:ring-cream/20'
  }`
}

export function messageClass(hasError: boolean): string {
  return `mt-1.5 text-xs ${hasError ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`
}
