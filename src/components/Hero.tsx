'use client'

import MaskReveal from './MaskReveal'
import { useLanguage } from './LanguageProvider'
import { HERO, LINKS, PROFILE } from '@/data/site'

export default function Hero() {
  const { language } = useLanguage()
  const t = HERO[language]

  return (
    <MaskReveal
      id="top"
      heading="h1"
      lines={PROFILE.nameLines}
      // El zoom entra por la "T" de JONATHAN.
      zoomLine={0}
      zoomChar={4}
      length={320}
      scrollHint={t.scroll}
      before={<p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted sm:text-xs">{t.label}</p>}
      after={
        <>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-ink/85 sm:text-lg">{t.pitch}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#work"
              className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-bold text-bg transition-colors hover:bg-ink"
            >
              {t.ctaWork}
            </a>
            <a
              href={LINKS.cv}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-full border border-ink/30 px-6 text-sm font-bold transition-colors hover:border-accent hover:text-accent"
            >
              {t.ctaCv}
            </a>
          </div>
        </>
      }
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="max-w-4xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          {t.statement}
        </p>
        <ul className="mt-10 grid max-w-3xl grid-cols-3 gap-6 border-t border-ink/20 pt-6 sm:mt-14">
          {t.facts.map((fact) => (
            <li key={fact.label}>
              <span className="block text-3xl font-extrabold text-accent sm:text-5xl">{fact.value}</span>
              <span className="mt-2 block font-mono text-[11px] uppercase leading-relaxed tracking-wider text-ink/70 sm:text-xs">
                {fact.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </MaskReveal>
  )
}
