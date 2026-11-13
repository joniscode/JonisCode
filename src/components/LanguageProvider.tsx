'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Language = 'en' | 'es'

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en'

  const saved = window.localStorage.getItem('language')
  if (saved === 'es' || saved === 'en') return saved

  // Sin preferencia guardada: español si el navegador está en español, inglés en el resto.
  return window.navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
}

function applyDocumentLanguage(language: Language) {
  document.documentElement.lang = language
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const initialLanguage = readInitialLanguage()
    setLanguageState(initialLanguage)
    applyDocumentLanguage(initialLanguage)
  }, [])

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage)
    window.localStorage.setItem('language', nextLanguage)
    applyDocumentLanguage(nextLanguage)
  }

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage(language === 'en' ? 'es' : 'en'),
    }),
    [language]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
