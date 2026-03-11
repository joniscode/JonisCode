'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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

const START_YEAR = 2023

export default function ExperienceSection({ items }: { items: ExperienceItem[] }) {
  const sorted = useMemo(() => [...items].sort((a, b) => b.year - a.year), [items])
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLElement | null>>([])

  const years = useMemo(() => {
    const latest = Math.max(sorted[0]?.year ?? START_YEAR, START_YEAR)
    const earliest = Math.min(sorted[sorted.length - 1]?.year ?? START_YEAR, START_YEAR)
    const result: number[] = []

    for (let year = latest; year >= earliest; year -= 1) {
      result.push(year)
    }

    return result
  }, [sorted])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const syncActiveCard = () => {
      const center = track.scrollLeft + track.clientWidth / 2
      let nextIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      cardRefs.current.forEach((card, index) => {
        if (!card) return

        const cardCenter = card.offsetLeft + card.offsetWidth / 2
        const distance = Math.abs(cardCenter - center)

        if (distance < closestDistance) {
          closestDistance = distance
          nextIndex = index
        }
      })

      setActiveIndex(nextIndex)
    }

    const onWheel = (event: WheelEvent) => {
      if (track.scrollWidth <= track.clientWidth) return

      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX
      if (delta === 0) return

      event.preventDefault()
      track.scrollBy({ left: delta, behavior: 'smooth' })
    }

    syncActiveCard()
    track.addEventListener('wheel', onWheel, { passive: false })
    track.addEventListener('scroll', syncActiveCard, { passive: true })
    window.addEventListener('resize', syncActiveCard)

    return () => {
      track.removeEventListener('wheel', onWheel)
      track.removeEventListener('scroll', syncActiveCard)
      window.removeEventListener('resize', syncActiveCard)
    }
  }, [sorted.length])

  const activeYear = sorted[activeIndex]?.year

  return (
    <section id="experience" className="relative z-10 py-16">
      <div className="container mx-auto px-4">
        <header className="mx-auto mb-10 max-w-3xl space-y-4 text-center">
          <h2 className="text-4xl font-bold">
            <span className="text-gradient-gpt">Experiencia destacada</span>
          </h2>
          <p className="text-lg opacity-80">
            Desarrollador Front-End con experiencia creando interfaces web escalables y de alto rendimiento en entornos corporativos y e-commerce.
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[160px,minmax(0,1fr)] xl:items-start">
          <aside className="hidden xl:block xl:sticky xl:top-24">
            <div className="relative mx-auto flex min-h-[440px] w-24 flex-col items-center justify-between py-4">
              <div className="absolute bottom-0 top-0 w-px bg-white/12" />

              {years.map((year) => {
                const isActive = year === activeYear

                return (
                  <div key={year} className="relative z-10 flex flex-col items-center">
                    <div
                      className={[
                        'grid h-12 w-12 place-items-center rounded-full border text-[11px] font-semibold tracking-[0.12em] transition-all duration-300',
                        isActive
                          ? 'border-cyan-300/70 bg-cyan-400 text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.45)]'
                          : 'border-white/15 bg-slate-900/90 text-white/75',
                      ].join(' ')}
                    >
                      {year}
                    </div>
                  </div>
                )
              })}
            </div>
          </aside>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/10 backdrop-blur dark:bg-white/5">
            <div
              ref={trackRef}
              className="flex items-stretch gap-6 overflow-x-auto overflow-y-hidden px-4 py-6 sm:px-6 lg:px-8 xl:px-10 no-scrollbar snap-x snap-mandatory overscroll-x-contain scroll-smooth touch-pan-x"
            >
              {sorted.map((exp, index) => (
                <article
                  key={exp.id}
                  ref={(node) => {
                    cardRefs.current[index] = node
                  }}
                  className="flex w-[calc(100%-1rem)] shrink-0 snap-center flex-col space-y-3 sm:w-[calc(100%-1.5rem)] lg:w-[calc(100%-2rem)] xl:max-w-[920px] 2xl:w-[920px]"
                >
                  <div className="flex items-center gap-3 xl:hidden">
                    <div
                      className={[
                        'grid h-10 w-10 place-items-center rounded-full border text-[10px] font-semibold tracking-[0.12em] transition-all duration-300',
                        exp.year === activeYear
                          ? 'border-cyan-300/70 bg-cyan-400 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.4)]'
                          : 'border-white/15 bg-slate-900/90 text-white/80',
                      ].join(' ')}
                    >
                      {exp.year}
                    </div>
                    <span className="text-sm uppercase tracking-[0.2em] text-white/55">Experiencia</span>
                  </div>

                  <ExperienceCard className="mx-auto w-full max-w-none" {...exp} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
