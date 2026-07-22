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

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        d="M12 2v3m0 14v3M4.93 4.93l2.12 2.12m9.9 9.9 2.12 2.12M2 12h3m14 0h3M4.93 19.07l2.12-2.12m9.9-9.9 2.12-2.12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M20.2 14.6A7.8 7.8 0 0 1 9.4 3.8 8.8 8.8 0 1 0 20.2 14.6Z" />
    </svg>
  )
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
    <div className="fixed right-3 top-2 z-[10001] flex overflow-hidden rounded-full bg-white/72 text-xs text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur dark:bg-slate-950/62 dark:text-slate-100 dark:shadow-[0_10px_30px_rgba(2,6,23,0.35)] sm:right-4 sm:text-sm">
      <button
        onClick={toggle}
        className="grid h-9 w-10 place-items-center transition hover:bg-cyan-100/70 dark:hover:bg-cyan-300/10 sm:h-10 sm:w-11"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
      <button
        onClick={toggleLanguage}
        className="h-9 min-w-10 px-2.5 font-bold transition hover:bg-cyan-100/70 dark:hover:bg-cyan-300/10 sm:h-10 sm:min-w-11 sm:px-3"
        aria-label={language === 'en' ? 'Cambiar a español' : 'Switch to English'}
        title={language === 'en' ? 'Cambiar a español' : 'Switch to English'}
      >
        {language === 'en' ? 'ES' : 'EN'}
      </button>
    </div>
  )
}
