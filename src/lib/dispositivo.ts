import type { Dispositivo } from '../types/examen'

/** Tipo de dispositivo desde el que se responde (se reporta al reclutador) */
export function detectarDispositivo(): Dispositivo {
  const ua = navigator.userAgent
  const ipadOs = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1
  if (ipadOs || /iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return 'tablet'
  if (/Mobi|iPhone|Android/i.test(ua)) return 'movil'
  return 'escritorio'
}
