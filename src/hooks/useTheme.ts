import { useCallback, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

/** El script de index.html ya aplicó el tema inicial a <html> */
function readCurrentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Almacenamiento no disponible (modo privado): el tema dura solo esta visita
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readCurrentTheme)

  const toggleTheme = useCallback(() => {
    const next: Theme = readCurrentTheme() === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }, [])

  return { theme, toggleTheme }
}
