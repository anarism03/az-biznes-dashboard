import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ThemeMode } from '../types/dashboard'

interface ThemeContextValue {
  theme: ThemeMode
  toggleTheme: () => void
}

const ThemeCtx = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => undefined,
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('az_dash_theme')
    return saved === 'dark' || saved === 'light' ? saved : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('az_dash_theme', theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    }),
    [theme],
  )

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
