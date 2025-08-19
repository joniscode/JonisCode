'use client'

import { useMemo, useRef } from 'react'
import ExperienceCard from '@/components/ExperienceCard'
import useWheelToHorizontal from '@/hooks/useWheelToHorizontal'

export type ExperienceItem = {
  id: string
  year: number
  icon?: string
  title: string
  roleLine: string
  companyLine?: string
  tags?: string[]
  description?: string
  achievements?: string[]
  period?: string
  linkHref?: string
  linkLabel?: string
}

export default function ExperienceSection({ items }: { items: ExperienceItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  useWheelToHorizontal(trackRef)

  // Años 2019 -> actual (desc, arriba lo más nuevo)
  const years = useMemo(() => {
    const start = 2019
    const now = new Date().getFullYear()
    return Array.from({ length: now - start + 1 }, (_, i) => now - i)
  }, [])

  // Ordena por año desc
  const sorted = useMemo(() => [...items].sort((a, b) => b.year - a.year), [items])

  // Asegura al menos 3 elementos (duplica si faltan)
  const slides = useMemo(() => {
    const out = [...sorted]
    while (out.length < 3 && sorted.length > 0) out.push(sorted[out.length % sorted.length])
    return out
  }, [sorted])

  return (
    <section id="about" className="relative z-10 py-24">
      <div className="container mx-auto px-0 md:px-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Columna izquierda sticky (título + timeline) */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="sticky top-20">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gradient-gpt">Experiencia destacada</h2>

              <div className="relative mt-8 pl-8">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-white/15" />
                <div className="absolute -left-1 top-0 w-6 h-6 rounded-full bg-slate-700/70 ring-2 ring-white/20" />
                <ul className="space-y-4">
                  {years.map(y => (
                    <li key={y} className="relative">
                      <div className="absolute -left-1 top-2 w-3 h-3 rounded-full bg-white/30" />
                      <span className="text-sm opacity-80">{y}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Carril derecho con scroll lateral */}
          <div className="col-span-12 lg:col-span-8">
            <div
              ref={trackRef}
              className="
                overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth
                snap-x snap-mandatory touch-pan-x
                grid grid-flow-col gap-8 pr-4 pb-2
                auto-cols-[min(100%,920px)]   /* 👈 FIX clave */
              "
            >
              {slides.map((exp, i) => (
                <article key={`${exp.id}-${i}`} className="snap-center lg:snap-start px-1">
                  <ExperienceCard
                    className="mx-auto max-w-[820px]" /* más angosta y centrada */
                    icon={exp.icon}
                    title={exp.title}
                    roleLine={exp.roleLine}
                    companyLine={exp.companyLine}
                    tags={exp.tags}
                    description={exp.description}
                    achievements={exp.achievements}
                    period={exp.period}
                    linkHref={exp.linkHref}
                    linkLabel={exp.linkLabel}
                  />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
