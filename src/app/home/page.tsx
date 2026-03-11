import TechCard from '@/components/TechCard'
import ConstellationBackground from '@/components/ConstellationBackground'
import TechRing from '@/components/TechRing'
import SectionDivider from '@/components/SectionDivider'
import ExperienceSection from '@/components/ExperienceSection'
import { EXPERIENCES } from '@/data/experience'

const stacksGrid: string[] = ['css', 'javascript', 'sass', 'angular', 'react', 'vue']
const ringItems: string[] = [...stacksGrid, 'typescript', 'html', 'github']

export default function PortfolioPage() {
  return (
    <main className="relative min-h-screen">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <ConstellationBackground />
      </div>

      <ExperienceSection items={EXPERIENCES} />

      <SectionDivider duration={5200} />

      <section id="hero" className="relative z-10 container mx-auto px-4 py-20">
        <header className="mx-auto max-w-3xl space-y-4 text-center">
          <h1 className="text-4xl font-bold">
            <span className="text-gradient-gpt">Tecnologias</span> 🖥️
          </h1>
          <p className="text-lg opacity-80">
            Pincha en una card y descubre proyectos de estudio segun cada tecnologia.
          </p>
        </header>

        <ul className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-6">
          {stacksGrid.map((slug) => (
            <li
              key={slug}
              className="flex min-w-0 basis-[calc(50%-0.5rem)] max-[380px]:basis-full sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(25%-1.125rem)]"
            >
              <TechCard slug={slug} />
            </li>
          ))}
        </ul>
      </section>

      <SectionDivider duration={5200} delay={2500} />

      <section id="tech-ring" className="relative z-10">
        <div className="container mx-auto px-4">
          <TechRing items={ringItems} />
        </div>
      </section>
    </main>
  )
}
