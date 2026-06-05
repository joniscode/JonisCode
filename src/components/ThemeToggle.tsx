'use client'

import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark'

function readPreferredTheme(): ThemeMode {
  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>('light')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const initialTheme = readPreferredTheme()

    setTheme(initialTheme)
    applyTheme(initialTheme)
    setMounted(true)

    const onMediaChange = () => {
      const saved = localStorage.getItem('theme')
      if (saved === 'light' || saved === 'dark') return

      const nextTheme: ThemeMode = mediaQuery.matches ? 'dark' : 'light'
      setTheme(nextTheme)
      applyTheme(nextTheme)
    }

    mediaQuery.addEventListener('change', onMediaChange)
    return () => mediaQuery.removeEventListener('change', onMediaChange)
  }, [])

  const toggle = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    applyTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)
  }

  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      className="fixed right-3 top-3 z-50 rounded-full border border-slate-200/80 bg-white/85 px-2.5 py-1.5 text-xs text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-slate-950/65 dark:text-slate-100 dark:shadow-[0_10px_30px_rgba(2,6,23,0.45)] sm:right-4 sm:top-4 sm:px-3 sm:py-2 sm:text-sm"
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      {isDark ? '☀ Claro' : '🌙 Oscuro'}
    </button>
  )
}
