import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import type { ThemeMode } from '../types/dashboard'

interface ThemeContextValue {
  theme: ThemeMode
  /** Klik nöqtəsi verilərsə, yeni tema həmin nöqtədən dairə kimi açılır. */
  toggleTheme: (origin?: { x: number; y: number }) => void
}

const ThemeCtx = createContext<ThemeContextValue>({ theme: 'light', toggleTheme: () => undefined })

const STORAGE_KEY = 'az_dash_theme'

function initialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    /* gizli rejimdə localStorage olmaya bilər */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(initialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#051420' : '#e6edf1')
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* yaddaş əlçatan deyil */
    }
  }, [theme])

  const toggleTheme = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: ThemeMode = theme === 'light' ? 'dark' : 'light'
      const root = document.documentElement
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!document.startViewTransition || reduce) {
        setTheme(next)
        return
      }
      const x = origin?.x ?? window.innerWidth - 60
      const y = origin?.y ?? 40
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
      root.dataset.themeSwitch = ''
      const vt = document.startViewTransition(() => {
        flushSync(() => setTheme(next))
        root.classList.toggle('dark', next === 'dark')
      })
      vt.ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
        )
      })
      vt.finished.finally(() => delete root.dataset.themeSwitch)
    },
    [theme],
  )

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
