'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useLanguage } from './LanguageProvider'
import { LINKS, NAV, PROFILE, UI } from '@/data/site'

export default function Header() {
  const { language, toggleLanguage } = useLanguage()
  const t = UI[language]
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    // Transparente mientras hay una transición a pantalla completa; sólido sobre el contenido.
    const onScroll = () => {
      const overStage = Array.from(document.querySelectorAll('[data-mask-stage]')).some((stage) => {
        const rect = stage.getBoundingClientRect()
        return rect.top <= 32 && rect.bottom >= 64
      })
      setSolid(!overStage)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        solid ? 'border-ink/10 bg-bg/80 backdrop-blur-md' : 'border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5 text-sm font-bold tracking-tight">
          <Image src="/images/Logo.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
          <span>{PROFILE.name}</span>
        </a>

        <nav
          aria-label={t.sections}
          className="hidden items-center gap-7 font-mono text-xs uppercase tracking-wider text-ink/70 md:flex"
        >
          {NAV[language].map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-accent">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={t.switchLanguage}
            className="h-9 rounded-full border border-ink/20 px-3 font-mono text-xs font-bold transition-colors hover:border-accent hover:text-accent"
          >
            {t.switchTo}
          </button>
          <a
            href={LINKS.cv}
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 items-center rounded-full bg-ink px-4 text-xs font-bold text-bg transition-colors hover:bg-accent sm:inline-flex"
          >
            {t.cv}
          </a>
        </div>
      </div>
    </header>
  )
}
