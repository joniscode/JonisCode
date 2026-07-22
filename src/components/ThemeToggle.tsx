'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from './LanguageProvider'

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
  const { language, toggleLanguage } = useLanguage()

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
    <div className="fixed right-3 top-3 z-[60] flex overflow-hidden rounded-full border border-cyan-400/30 bg-white/88 text-xs text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur dark:border-cyan-300/25 dark:bg-slate-950/72 dark:text-slate-100 dark:shadow-[0_10px_30px_rgba(2,6,23,0.45)] sm:right-4 sm:top-4 sm:text-sm">
      <button
        onClick={toggle}
        className="grid h-9 w-10 place-items-center transition hover:bg-cyan-100/80 dark:hover:bg-cyan-300/10 sm:h-10 sm:w-11"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span aria-hidden className="text-base leading-none sm:text-lg">
          {isDark ? '☀' : '☾'}
        </span>
      </button>
      <button
        onClick={toggleLanguage}
        className="h-9 min-w-10 border-l border-cyan-400/25 px-2.5 font-bold transition hover:bg-cyan-100/80 dark:border-cyan-300/20 dark:hover:bg-cyan-300/10 sm:h-10 sm:min-w-11 sm:px-3"
        aria-label={language === 'en' ? 'Cambiar a español' : 'Switch to English'}
        title={language === 'en' ? 'Cambiar a español' : 'Switch to English'}
      >
        {language === 'en' ? 'ES' : 'EN'}
      </button>
    </div>
  )
}
