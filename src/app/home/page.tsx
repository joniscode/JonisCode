'use client'

import TechCard from '@/components/TechCard'
import ConstellationBackground from '@/components/ConstellationBackground'
import TechRing from '@/components/TechRing'
import SectionDivider from '@/components/SectionDivider'
import ScrollScenes from '@/components/ScrollScenes'
import ExperienceSection from '@/components/ExperienceSection'
import { EXPERIENCES } from '@/data/experience'

const stacksGrid: string[] = ['css','javascript','sass','angular','react','vue']
const ringItems: string[]  = [...stacksGrid, 'typescript','html','github']

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <ConstellationBackground />
      <ScrollScenes />

      {/* SECTION 1 (ABOUT) */}
      <ExperienceSection items={EXPERIENCES} />

      <SectionDivider duration={5200} />

      {/* SECTION 2 (Tecnologías) */}
      <section id="hero" className="relative z-10 container mx-auto px-4 py-20">
        <header className="space-y-4 max-w-3xl will-change-transform">
          <h1 className="hero-title text-4xl font-bold">
            <span className="text-gradient-gpt">¡Tecnologias!</span> 🖥️
          </h1>
          <p className="hero-paragraph text-lg opacity-80">
            Pincha en una card's y descubre proyectos de estudio, segun tecnologias…
          </p>
        </header>

        <ul className="cards-grid mt-10 flex flex-wrap justify-center gap-6 items-stretch will-change-transform">
          {stacksGrid.map(slug => (
            <li key={slug} className="w-full sm:w-1/2 lg:w-1/4 max-w-[22rem] flex">
              <TechCard slug={slug} />
            </li>
          ))}
        </ul>
      </section>

      <SectionDivider duration={5200} delay={2500} />

      {/* SECTION 3 (RING) */}
      <section id="tech-ring" className="relative z-10 py-24">
        <div className="ring-wrap container mx-auto px-4">
          <TechRing items={ringItems} />
        </div>
      </section>

      
    </main>
  )
}
