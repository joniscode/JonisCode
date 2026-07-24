'use client'

import TechCard from '@/components/TechCard'
import ConstellationBackground from '@/components/ConstellationBackground'
import TechRing from '@/components/TechRing'
import SectionDivider from '@/components/SectionDivider'
import ExperienceSection from '@/components/ExperienceSection'
import CareerOverviewSection from '@/components/CareerOverviewSection'
import { useLanguage } from '@/components/LanguageProvider'
import { EXPERIENCES } from '@/data/experience'
import { HOME_TECHNOLOGIES, RING_TECHNOLOGIES } from '@/data/techProjects'

const COPY = {
  en: {
    portfolioTitle: 'Portfolio',
    portfolioCopy: 'Open a card to explore study projects and practical work by technology.',
  },
  es: {
    portfolioTitle: 'Portafolio',
    portfolioCopy: 'Abre una tarjeta para explorar proyectos de estudio y trabajos prácticos por tecnología.',
  },
} as const

export default function PortfolioPage() {
  const { language } = useLanguage()
  const t = COPY[language]

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#040914] dark:text-slate-100">
      <main className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <ConstellationBackground quality="lite" />
        </div>

        <CareerOverviewSection />

        <SectionDivider />

        <section id="tools" className="relative z-0 py-8 sm:py-10 lg:py-12">
          <div className="container mx-auto px-4">
            <TechRing items={RING_TECHNOLOGIES} />
          </div>
        </section>

        <SectionDivider />

        <section id="portfolio" className="relative z-10 container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <header className="mx-auto max-w-3xl space-y-4 text-center">
            <h1 className="text-4xl font-bold">
              <span className="text-gradient-gpt">{t.portfolioTitle}</span>
            </h1>
            <p className="text-lg opacity-80">{t.portfolioCopy}</p>
          </header>

          <ul className="mx-auto mt-10 flex flex-wrap justify-center gap-5 sm:gap-6">
            {HOME_TECHNOLOGIES.map((technology) => (
              <li key={technology.slug} className="w-full min-w-0 min-[420px]:w-[280px] lg:w-[260px]">
                <TechCard slug={technology.slug} icon={technology.icon} label={technology.label} />
              </li>
            ))}
          </ul>
        </section>

        <SectionDivider />

        <ExperienceSection items={EXPERIENCES} />
      </main>
    </div>
  )
}
