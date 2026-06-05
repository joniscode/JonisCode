'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import TechCard from '@/components/TechCard'
import ConstellationBackground from '@/components/ConstellationBackground'
import TechRing from '@/components/TechRing'
import SectionDivider from '@/components/SectionDivider'
import ExperienceSection from '@/components/ExperienceSection'
import CareerOverviewSection from '@/components/CareerOverviewSection'
import { EXPERIENCES } from '@/data/experience'

const stacksGrid: string[] = ['css', 'javascript', 'sass', 'angular', 'react', 'vue']
const ringItems = [
  'css',
  'javascript',
  'sass',
  'angular',
  'react',
  'typescript',
  'html',
  'github',
  { slug: 'tailwind', label: 'Tailwind', icon: '/icons/Tailwind.png' },
  { slug: 'bootstrap', label: 'Bootstrap', icon: '/icons/Bootstrap.png' },
  { slug: 'nextjs', label: 'Next.js', icon: '/icons/next.png' },
  { slug: 'postman', label: 'Postman', icon: '/icons/postman.png' },
  { slug: 'magento', label: 'Magento', icon: '/icons/magento.png' },
  { slug: 'liferay', label: 'Liferay', icon: '/icons/Liferay.png' },
]
const HOME_REVEAL_KEY = 'joniscode-home-reveal'
const HOME_REVEAL_ORIGIN_KEY = 'joniscode-home-reveal-origin'

type RevealState =
  | { mode: 'off' }
  | { mode: 'reveal'; x: number; y: number; radius: number }

export default function PortfolioPage() {
  const prefersReducedMotion = useReducedMotion()
  const [revealState, setRevealState] = useState<RevealState>({ mode: 'off' })

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    const resetScroll = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    resetScroll()
    const frameA = requestAnimationFrame(resetScroll)
    const frameB = requestAnimationFrame(() => requestAnimationFrame(resetScroll))
    const timer = window.setTimeout(resetScroll, 60)
    let resizeFrame = 0

    const onResize = () => {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(resetScroll)
    }

    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameA)
      cancelAnimationFrame(frameB)
      cancelAnimationFrame(resizeFrame)
      window.clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      window.history.scrollRestoration = previousRestoration
    }
  }, [])

  useEffect(() => {
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
      const radius = Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y)
      )

      setRevealState({ mode: 'reveal', x: origin.x, y: origin.y, radius })
    } catch {
      setRevealState({ mode: 'off' })
    }
  }, [prefersReducedMotion])

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#040914] dark:text-slate-100">
      <motion.main
        className="relative"
        initial={false}
        animate={
          revealState.mode === 'reveal'
            ? {
                clipPath: `circle(${revealState.radius}px at ${revealState.x}px ${revealState.y}px)`,
                opacity: 1,
                scale: 1,
              }
            : {
                opacity: 1,
                scale: 1,
              }
        }
        style={
          revealState.mode === 'reveal'
            ? {
                clipPath: `circle(${revealState.radius}px at ${revealState.x}px ${revealState.y}px)`,
              }
            : undefined
        }
        transition={{
          duration: revealState.mode === 'reveal' ? 0.95 : 0.2,
          ease: [0.16, 0.84, 0.2, 1],
        }}
        onAnimationComplete={() => {
          if (revealState.mode === 'reveal') {
            setRevealState({ mode: 'off' })
          }
        }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <ConstellationBackground />
        </div>

        <CareerOverviewSection />

        <SectionDivider duration={5200} />

        <section id="tech-ring" className="relative z-10">
          <div className="container mx-auto px-4">
            <TechRing items={ringItems} />
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

        <ExperienceSection items={EXPERIENCES} />
      </motion.main>

      <AnimatePresence>
        {revealState.mode === 'reveal' && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.78, ease: 'easeOut' }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.95 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.74, ease: 'easeOut' }}
              style={{
                background:
                  `radial-gradient(circle at ${revealState.x}px ${revealState.y}px, rgba(19,176,245,0.28) 0%, rgba(47,128,237,0.2) 10%, rgba(4,9,20,0.78) 26%, rgba(4,9,20,0.96) 100%)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
