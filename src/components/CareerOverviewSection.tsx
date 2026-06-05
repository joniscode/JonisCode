'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

const STATS = [
  { label: 'Horas de estudio', value: 3200, suffix: '+' },
  { label: 'Horas de trabajo', value: 6800, suffix: '+' },
  { label: 'Proyectos culminados', value: 14, suffix: '+' }
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

function StatTile({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const animatedValue = useAnimatedValue(value)

  return (
    <article className="border-b border-slate-200/70 pb-5 text-slate-900 dark:border-white/10 dark:text-slate-100">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-white/50">{label}</p>
      <p className="mt-3 text-3xl font-black sm:text-4xl">
        {animatedValue}
        {suffix}
      </p>
    </article>
  )
}

export default function CareerOverviewSection() {
  const projectThemes = useMemo(
    () => [
      'Microfrontends para flujos de salud y autoadmision.',
      'Migraciones web con Next.js y arquitectura modular.',
      'Portales empresariales con foco en rendimiento y escalabilidad.',
      'Ecommerce e integraciones con plataformas y APIs externas.',
    ],
    []
  )

  return (
    <section id="career-overview" className="relative z-10 container mx-auto px-4 pt-16 pb-16 sm:pt-20 lg:pt-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/30 dark:shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10">
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
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              <span className="text-gradient-gpt">Jonis Code</span>
              <br />
              <span className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
                Hola, soy Jonathan Frontend Developer, de Colombia para el mundo
              </span>
            </h1>
          </header>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr,0.9fr,1.05fr] lg:items-center">
            <aside className="space-y-4">
              <article className="rounded-2xl border border-slate-200/80 bg-white/75 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.1)] backdrop-blur dark:border-white/10 dark:bg-slate-950/35 dark:shadow-[0_18px_40px_rgba(0,0,0,0.24)]">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-white/50">
                  Huella de proyectos
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700 dark:text-white/72">
                  {projectThemes.map((theme) => (
                    <li key={theme} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
                      <span>{theme}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </aside>

            <div className="relative mx-auto flex w-full max-w-md justify-center">
              <div className="absolute inset-x-8 top-10 h-40 rounded-full bg-cyan-400/18 blur-3xl" />
              <div className="absolute inset-x-10 bottom-6 h-32 rounded-full bg-fuchsia-400/12 blur-3xl" />
              <div className="relative h-[26rem] w-full overflow-hidden rounded-[2.8rem] border border-white/10 shadow-[0_0_60px_rgba(56,189,248,0.12)] sm:h-[32rem]">
                <Image
                  src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExanpiNTBiMzJmNTBnZnMxenJzNXpyNGR6ZGM5Z21iNXV6aTUyNW1scSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/TFPdmm3rdzeZ0kP3zG/giphy.gif"
                  alt="Developer animation"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </div>

            <aside className="space-y-5">
              {STATS.map((stat) => (
                <StatTile key={stat.label} {...stat} />
              ))}
            </aside>
          </div>

        </div>
      </div>
    </section>
  )
}
