import ConstellationBackground from '@/components/ConstellationBackground'
import TechShowcaseCard from '@/components/TechShowcaseCard'
import { TECH_SLUGS, getTechEntry } from '@/data/techProjects'

export async function generateStaticParams() {
  return TECH_SLUGS.map((slug) => ({ slug }))
}

export default async function TechDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = getTechEntry(slug)

  return (
    <main className="relative min-h-[100svh] overflow-hidden py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <ConstellationBackground />
      </div>

      <section className="container mx-auto px-4">
        <header className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/50">{entry.label}</p>
          <h1 className="text-4xl font-black sm:text-5xl">
            <span className="text-gradient-gpt">{entry.label}</span>
          </h1>
          <p className="text-base opacity-80 sm:text-lg">
            Proyectos relacionados con esta tecnologia. Cada card funciona como enlace y abre en una nueva pestana.
          </p>
        </header>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {entry.projects.map((project) => (
            <TechShowcaseCard
              key={project.name}
              name={project.name}
              image={project.image}
              href={project.href}
              label={entry.label}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
