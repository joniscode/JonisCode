'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import ExperienceCard from './ExperienceCard'

export type ExperienceItem = {
  id: string
  year: number
  sortOrder?: number
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
  const currentYear = new Date().getFullYear()
  const sorted = useMemo(
    () =>
      [...items].sort(
        (a, b) => (b.sortOrder ?? b.year) - (a.sortOrder ?? a.year) || b.year - a.year
      ),
    [items]
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAtStart, setIsAtStart] = useState(true)
  const [activeCardHeight, setActiveCardHeight] = useState<number | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLElement | null>>([])
  const activeIndexRef = useRef(0)
  const syncFrameRef = useRef<number | null>(null)

  const years = useMemo(() => {
    const latest = Math.max(sorted[0]?.year ?? START_YEAR, currentYear, START_YEAR)
    const earliest = Math.min(sorted[sorted.length - 1]?.year ?? START_YEAR, START_YEAR)
    const result: number[] = []

    for (let year = latest; year >= earliest; year -= 1) {
      result.push(year)
    }

    return result
  }, [currentYear, sorted])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const scrollByViewport = (direction: 1 | -1) => {
      track.scrollBy({
        left: track.clientWidth * 0.82 * direction,
        behavior: 'smooth',
      })
    }

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

      if (activeIndexRef.current !== nextIndex) {
        activeIndexRef.current = nextIndex
        setActiveIndex(nextIndex)
      }

      const nextIsAtStart = track.scrollLeft <= 8
      setIsAtStart((prev) => (prev === nextIsAtStart ? prev : nextIsAtStart))
    }

    const onWheel = (event: WheelEvent) => {
      if (track.scrollWidth <= track.clientWidth) return

      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX
      if (delta === 0) return

      event.preventDefault()
      track.scrollBy({ left: delta, behavior: 'auto' })
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        scrollByViewport(1)
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        scrollByViewport(-1)
      }
    }

    const scheduleSync = () => {
      if (syncFrameRef.current !== null) return

      syncFrameRef.current = requestAnimationFrame(() => {
        syncFrameRef.current = null
        syncActiveCard()
      })
    }

    syncActiveCard()
    track.addEventListener('wheel', onWheel, { passive: false })
    track.addEventListener('keydown', onKeyDown)
    track.addEventListener('scroll', scheduleSync, { passive: true })
    window.addEventListener('resize', scheduleSync)

    return () => {
      if (syncFrameRef.current !== null) cancelAnimationFrame(syncFrameRef.current)
      track.removeEventListener('wheel', onWheel)
      track.removeEventListener('keydown', onKeyDown)
      track.removeEventListener('scroll', scheduleSync)
      window.removeEventListener('resize', scheduleSync)
    }
  }, [sorted.length])

  useEffect(() => {
    const updateActiveHeight = () => {
      const activeCard = cardRefs.current[activeIndex]
      if (!activeCard) return

      const verticalPadding = 48
      const nextHeight = Math.ceil(activeCard.offsetHeight + verticalPadding)
      setActiveCardHeight((prev) => (prev === nextHeight ? prev : nextHeight))
    }

    updateActiveHeight()
    window.addEventListener('resize', updateActiveHeight)
    return () => window.removeEventListener('resize', updateActiveHeight)
  }, [activeIndex, sorted.length])

  const activeYear = sorted[activeIndex]?.year
  const highlightedYear = isAtStart && years.includes(currentYear) ? currentYear : activeYear

  return (
    <section id="experience" className="relative z-10 pt-10 pb-10 sm:pt-12 sm:pb-12 lg:pt-16">
      <div className="container mx-auto px-4">
        <header className="mx-auto mb-8 max-w-3xl space-y-3 text-center sm:mb-10">
          <h2 className="text-4xl font-bold">
            <span className="text-gradient-gpt">Experiencia destacada</span>
          </h2>
          <p className="text-lg opacity-80">Trayectoria profesional en desarrollo frontend.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[160px,1fr] lg:items-start">
          <aside className="hidden lg:block">
              <div className="relative mx-auto flex min-h-[400px] w-24 flex-col items-center justify-between py-4">
              {years.map((year) => {
                const isActive = year === highlightedYear

                return (
                  <div key={year} className="relative z-10 flex flex-col items-center">
                    <div
                      className={[
                        'grid h-12 w-12 place-items-center rounded-full border text-[11px] font-semibold tracking-[0.12em] transition-all duration-300',
                        isActive
                          ? 'border-cyan-300/70 bg-cyan-400 text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.45)]'
                          : 'border-slate-300/90 bg-white/85 text-slate-600 dark:border-white/15 dark:bg-slate-900/90 dark:text-white/75',
                      ].join(' ')}
                    >
                      {year}
                    </div>
                  </div>
                )
              })}
            </div>
          </aside>

          <div
            className="relative overflow-hidden transition-[height] duration-300 ease-out"
            style={activeCardHeight ? { height: `${activeCardHeight}px` } : undefined}
          >
            {isAtStart ? (
              <div className="pointer-events-none absolute right-5 top-1/2 z-10 -translate-y-1/2 lg:hidden">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-2xl text-white/90 shadow-[0_14px_36px_rgba(2,6,23,0.45)] backdrop-blur-md animate-horizontal-nudge">
                  <span aria-hidden>→</span>
                </div>
              </div>
            ) : null}

            <div
              ref={trackRef}
              tabIndex={0}
              role="region"
              aria-label="Carrusel horizontal de experiencia destacada"
              className="scrollbar-gutter-stable overflow-x-auto overflow-y-hidden px-4 py-6 no-scrollbar snap-x snap-mandatory overscroll-x-contain scroll-smooth touch-pan-x focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 md:px-6"
            >
              <div className="flex min-w-max items-start gap-4 md:gap-5">
                {sorted.map((exp, index) => (
                  <article
                    key={exp.id}
                    ref={(node) => {
                      cardRefs.current[index] = node
                    }}
                    className="w-[min(88vw,860px)] shrink-0 snap-center sm:w-[min(84vw,860px)] md:w-[min(76vw,860px)]"
                  >
                    <div className="mb-3 flex items-center gap-3 lg:hidden">
                      <div
                        className={[
                          'grid h-10 w-10 place-items-center rounded-full border text-[10px] font-semibold tracking-[0.12em] transition-all duration-300',
                          exp.year === activeYear
                            ? 'border-cyan-300/70 bg-cyan-400 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.4)]'
                            : 'border-slate-300/90 bg-white/85 text-slate-600 dark:border-white/15 dark:bg-slate-900/90 dark:text-white/80',
                        ].join(' ')}
                      >
                        {exp.year}
                      </div>
                      <span className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-white/55">
                        Experiencia
                      </span>
                    </div>

                    <ExperienceCard className="mx-auto max-w-none" {...exp} />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
