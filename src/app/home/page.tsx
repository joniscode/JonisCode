'use client'

import { useEffect, useState } from 'react'
import TechCard from '@/components/TechCard'
import ConstellationBackground from '@/components/ConstellationBackground'
import TechRing from '@/components/TechRing'
import SectionDivider from '@/components/SectionDivider'
import ExperienceSection from '@/components/ExperienceSection'
import CareerOverviewSection from '@/components/CareerOverviewSection'
import { EXPERIENCES } from '@/data/experience'
import { HOME_TECHNOLOGIES, RING_TECHNOLOGIES } from '@/data/techProjects'
import usePrefersReducedMotion from '@/lib/usePrefersReducedMotion'

const HOME_REVEAL_KEY = 'joniscode-home-reveal'
const HOME_REVEAL_ORIGIN_KEY = 'joniscode-home-reveal-origin'

type RevealState =
  | { mode: 'off' }
  | { mode: 'reveal'; x: number; y: number }

export default function PortfolioPage() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [revealState, setRevealState] = useState<RevealState>({ mode: 'off' })

  useEffect(() => {
    window.scrollTo(0, 0)

    if (prefersReducedMotion) {
      window.sessionStorage.removeItem(HOME_REVEAL_KEY)
      window.sessionStorage.removeItem(HOME_REVEAL_ORIGIN_KEY)
      return
    }

    const shouldReveal = window.sessionStorage.getItem(HOME_REVEAL_KEY) === '1'
    const rawOrigin = window.sessionStorage.getItem(HOME_REVEAL_ORIGIN_KEY)

    window.sessionStorage.removeItem(HOME_REVEAL_KEY)
    window.sessionStorage.removeItem(HOME_REVEAL_ORIGIN_KEY)

    if (!shouldReveal || !rawOrigin) return

    try {
      const origin = JSON.parse(rawOrigin) as { x: number; y: number }
      setRevealState({ mode: 'reveal', x: origin.x, y: origin.y })
    } catch {
      setRevealState({ mode: 'off' })
    }
  }, [prefersReducedMotion])

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#040914] dark:text-slate-100">
      <main className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <ConstellationBackground quality="lite" />
        </div>

        <CareerOverviewSection />

        <SectionDivider duration={5200} />

        <section id="tech-ring" className="relative z-10">
          <div className="container mx-auto px-4">
            <TechRing items={RING_TECHNOLOGIES} />
          </div>
        </section>

        <SectionDivider duration={5200} delay={1800} />

        <section id="hero" className="relative z-10 container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <header className="mx-auto max-w-3xl space-y-4 text-center">
            <h1 className="text-4xl font-bold">
              <span className="text-gradient-gpt">Tecnologias</span> 🖥️
            </h1>
            <p className="text-lg opacity-80">
              Pincha en una card y descubre proyectos de estudio segun cada tecnologia.
            </p>
          </header>

          <ul className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-6">
            {HOME_TECHNOLOGIES.map((technology) => (
              <li
                key={technology.slug}
                className="flex min-w-0 basis-[calc(50%-0.5rem)] max-[380px]:basis-full sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(25%-1.125rem)]"
              >
                <TechCard
                  slug={technology.slug}
                  icon={technology.icon}
                  label={technology.label}
                />
              </li>
            ))}
          </ul>
        </section>

        <SectionDivider duration={5200} delay={2500} />

        <ExperienceSection items={EXPERIENCES} />
      </main>

      {revealState.mode === 'reveal' && (
        <div
          className="pointer-events-none absolute inset-0 z-20 animate-overlay-fade-out"
          onAnimationEnd={() => setRevealState({ mode: 'off' })}
        >
          <div
            className="absolute inset-0 animate-reveal-bloom-out"
            style={{
              background:
                `radial-gradient(circle at ${revealState.x}px ${revealState.y}px, rgba(19,176,245,0.26) 0%, rgba(47,128,237,0.18) 12%, rgba(4,9,20,0.36) 28%, rgba(4,9,20,0) 62%)`,
            }}
          />
        </div>
      )}
    </div>
  )
}
