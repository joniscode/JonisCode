import ConstellationBackground from '@/components/ConstellationBackground'
import TechShowcaseCard from '@/components/TechShowcaseCard'
import { TECH_SLUGS, getTechEntry } from '@/data/techProjects'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamicParams = false

export async function generateStaticParams() {
  return TECH_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getTechEntry(slug)

  if (!entry) {
    return {
      title: 'Tecnologia no encontrada',
    }
  }

  return {
    title: `${entry.label} | JonisCode`,
    description: `Proyectos y practicas relacionados con ${entry.label} dentro del portafolio de JonisCode.`,
  }
}

export default async function TechDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = getTechEntry(slug)
  if (!entry) notFound()

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-slate-50 py-16 text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <ConstellationBackground interactive={false} quality="lite" />
      </div>

      <section className="container mx-auto px-4">
        <header className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-white/50">{entry.label}</p>
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
              key={`${project.tech}:${project.href}`}
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
