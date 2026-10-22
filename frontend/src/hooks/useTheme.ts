import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'portfolio-theme'
const listeners = new Set<() => void>()

/** The inline script in index.html sets the `dark` class before React mounts, so
 * the class on <html> is the source of truth on the client. */
function getTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function setThemeValue(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // The theme still works for this session without persistence.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Persisted light/dark theme. Hydration uses the server snapshot ('light'), then
 * React re-renders with the real theme without a mismatch. */
export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribe, getTheme, () => 'light')
  const setTheme = useCallback((next: Theme) => setThemeValue(next), [])
  const toggleTheme = useCallback(() => setThemeValue(getTheme() === 'dark' ? 'light' : 'dark'), [])
  return { theme, setTheme, toggleTheme }
}
