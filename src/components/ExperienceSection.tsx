'use client'

import { useMemo, useRef } from 'react'
import useWheelToHorizontal from '@/hooks/useWheelToHorizontal'
import ExperienceCard from './ExperienceCard'

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
  // 1) Ordena de más nuevo a más antiguo
  const sorted = useMemo(() => [...items].sort((a, b) => b.year - a.year), [items])

  // 2) Asegura mínimo 3 slides duplicando si hiciera falta
  const slides = useMemo(() => {
    const out = sorted.length ? [...sorted] : []
    while (out.length < 3 && sorted.length > 0) out.push(sorted[out.length % sorted.length])
    return out
  }, [sorted])

  // 3) Rango de años para el timeline fijo (arriba nuevo → abajo antiguo)
  const years = useMemo(() => {
    const current = sorted[0]?.year ?? new Date().getFullYear()
    const min = sorted.length ? Math.min(...sorted.map(s => s.year)) : current - 6
    const ys: number[] = []
    for (let y = current; y >= min; y--) ys.push(y)
    return ys
  }, [sorted])

  // 4) Hook que convierte rueda en scroll horizontal
  const trackRef = useRef<HTMLDivElement>(null)
  useWheelToHorizontal(trackRef)

  const scrollBy = (dir: 'left' | 'right') => {
  const track = trackRef.current
  if (!track) return
  const step = Math.min(track.clientWidth * 0.9, 900) // desplazamiento cómodo
  track.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' })
}

// …en el JSX del header (arriba a la derecha)
<div className="flex items-center gap-2">
  <button onClick={() => scrollBy('left')} className="rounded-full px-3 py-2 border border-white/20 hover:bg-white/10">
    ◀
  </button>
  <button onClick={() => scrollBy('right')} className="rounded-full px-3 py-2 border border-white/20 hover:bg-white/10">
    ▶
  </button>
</div>



  return (
    <section id="experience" className="relative z-10 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-[260px,1fr] gap-6">
          {/* Columna izquierda fija: título + timeline */}
          <aside className="sticky top-16 self-start">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Experiencia destacada</h2>

            <div className="relative pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />
              {years.map(y => (
                <div key={y} className="relative py-4">
                  <div className="absolute -left-1.5 top-1.5 w-4 h-4 rounded-full bg-slate-700/70 ring-2 ring-white/20" />
                  <span className="text-sm opacity-80">{y}</span>
                </div>
              ))}
              <div className="absolute left-3 -bottom-3 w-3 h-3 rounded-full bg-slate-700/70 ring-2 ring-white/20" />
            </div>
          </aside>

          {/* Columna derecha: carril horizontal */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/10 dark:bg-white/5 backdrop-blur">
            <div
              ref={trackRef}
              className="
                overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth
                snap-x snap-mandatory touch-pan-x overscroll-x-contain
                grid grid-flow-col gap-8 pr-4 py-6
                auto-cols-[min(100%,920px)]
              "
            >
              {slides.map((exp, i) => (
                <article key={`${exp.id}-${i}`} className="snap-center lg:snap-start px-1">
                  {/* card **más estrecha** que el contenedor */}
                  <ExperienceCard className="mx-auto max-w-[820px]" {...exp} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
