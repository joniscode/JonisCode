'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { calculateStudyHours, calculateWorkHours } from '@/lib/hourCounters'

const PROJECTS_COMPLETED = 14

const STUDIES = [
  'Especialización en Transformación Digital - En curso',
  'Ingeniería de Sistemas - 2025',
  'Tecnólogo en Análisis y Desarrollo de Sistemas de Información - 2023',
  'Bootcamp Full Stack Junior Java - En curso',
  'Bootcamp de Inteligencia Artificial Básico - 2025',
]

function useAnimatedValue(target: number, durationMs = 1400) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) {
      setValue(target)
      return
    }

    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [durationMs, target])

  return value
}

function useLiveCareerHours() {
  const [hours, setHours] = useState(() => ({
    study: calculateStudyHours().hours,
    work: calculateWorkHours().hours,
  }))

  useEffect(() => {
    const updateHours = () => {
      setHours({
        study: calculateStudyHours().hours,
        work: calculateWorkHours().hours,
      })
    }

    updateHours()
    const interval = window.setInterval(updateHours, 1000)

    return () => window.clearInterval(interval)
  }, [])

  return hours
}

function StatTile({
  label,
  value,
  suffix,
  precision = 0,
  animated = true,
}: {
  label: string
  value: number
  suffix: string
  precision?: number
  animated?: boolean
}) {
  const animatedValue = useAnimatedValue(value)
  const displayValue = animated ? animatedValue : value

  return (
    <article className="border-b border-slate-200/70 pb-5 text-slate-900 dark:border-white/10 dark:text-slate-100">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-white/50">{label}</p>
      <p className="mt-3 text-3xl font-black sm:text-4xl">
        {displayValue.toLocaleString('es-CO', {
          maximumFractionDigits: precision,
          minimumFractionDigits: precision,
        })}
        {suffix}
      </p>
    </article>
  )
}

export default function CareerOverviewSection() {
  const careerHours = useLiveCareerHours()

  const stats = [
    { label: 'Horas de estudio', value: careerHours.study, suffix: '+', precision: 0, animated: false },
    { label: 'Horas de trabajo', value: careerHours.work, suffix: '+', precision: 0, animated: false },
    { label: 'Proyectos culminados', value: PROJECTS_COMPLETED, suffix: '+', precision: 0, animated: true },
  ]

  return (
    <section id="career-overview" className="relative z-10 container mx-auto px-4 pt-4 pb-10 sm:pt-8 sm:pb-12 lg:pt-12 lg:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(circle at 50% 18%, rgba(174,103,250,0.16), transparent 24%), radial-gradient(circle at 18% 78%, rgba(56,189,248,0.12), transparent 22%), radial-gradient(circle at 84% 68%, rgba(244,152,103,0.12), transparent 26%)',
        }}
      />

      <div className="relative">
        <header className="mx-auto max-w-4xl text-center">
          <h1 className="text-2xl font-black leading-[1.08] sm:text-4xl lg:text-5xl xl:text-6xl">
            <span className="text-gradient-gpt">Jonis Code</span>
            <br />
            <span className="text-lg font-bold text-slate-900 dark:text-white sm:text-2xl lg:text-3xl">
              Hola, soy Jonathan Frontend Developer, de Colombia para el mundo
            </span>
          </h1>
        </header>

        <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-5 lg:mt-8 lg:grid-cols-[0.95fr,0.95fr,0.85fr] lg:items-center">
          <aside className="order-3 space-y-4 lg:order-1">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-white/50">
                Estudios realizados
              </p>
              <ul className="mt-3 space-y-2.5 text-sm leading-6 text-slate-700 dark:text-white/72">
                {STUDIES.map((study) => (
                  <li key={study} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>{study}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="order-2 relative mx-auto flex w-full max-w-sm justify-center lg:order-2 lg:max-w-md">
            <div className="absolute inset-x-8 top-10 h-40 rounded-full bg-cyan-400/18 blur-3xl" />
            <div className="absolute inset-x-10 bottom-6 h-32 rounded-full bg-fuchsia-400/12 blur-3xl" />
            <div className="relative h-[17rem] w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_0_60px_rgba(56,189,248,0.12)] sm:h-[22rem] lg:h-[30rem]">
              <Image
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExanpiNTBiMzJmNTBnZnMxenJzNXpyNGR6ZGM5Z21iNXV6aTUyNW1scSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/TFPdmm3rdzeZ0kP3zG/giphy.gif"
                alt="Developer animation"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>

          <aside className="order-1 space-y-3 lg:order-3 lg:space-y-5">
            {stats.map((stat) => (
              <StatTile key={stat.label} {...stat} />
            ))}
          </aside>
        </div>
      </div>
    </section>
  )
}
