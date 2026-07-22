'use client'

import { useLanguage } from './LanguageProvider'

export type ExperienceItem = {
  id: string
  year: number
  sortOrder?: number
  icon?: string
  title: string
  titleEn?: string
  roleLine: string
  companyLine?: string
  tags?: string[]
  description?: string
  descriptionEn?: string
  achievements?: string[]
  period?: string
  periodEn?: string
  linkHref?: string
  linkLabel?: string
}

const markerStyles = [
  'bg-gradient-to-br from-cyan-300 to-blue-500 text-slate-950 shadow-cyan-400/25',
  'bg-gradient-to-br from-blue-400 to-cyan-300 text-slate-950 shadow-blue-400/25',
  'bg-gradient-to-br from-orange-300 to-orange-500 text-slate-950 shadow-orange-300/25',
]

const periodStyles = [
  'bg-gradient-to-r from-cyan-300 to-blue-500',
  'bg-gradient-to-r from-blue-400 to-cyan-300',
  'bg-gradient-to-r from-orange-300 to-orange-500',
]

const COPY = {
  en: {
    title: 'Experience',
    description: 'Professional path in frontend development.',
    companyConnector: 'at',
    cv: 'View full CV',
  },
  es: {
    title: 'Experiencia',
    description: 'Trayectoria profesional en desarrollo frontend.',
    companyConnector: 'en',
    cv: 'Ver CV completo',
  },
} as const

export default function ExperienceSection({ items }: { items: ExperienceItem[] }) {
  const { language } = useLanguage()
  const t = COPY[language]
  const sorted = [...items].sort(
    (a, b) => (b.sortOrder ?? b.year) - (a.sortOrder ?? a.year) || b.year - a.year
  )

  return (
    <section id="experience" className="relative z-10 pt-10 pb-12 sm:pt-12 sm:pb-14 lg:pt-16">
      <div className="container mx-auto px-4">
        <header className="mx-auto mb-8 max-w-3xl space-y-3 text-center sm:mb-10">
          <h2 className="text-4xl font-bold">
            <span className="text-gradient-gpt">{t.title}</span>
          </h2>
          <p className="text-lg opacity-80">{t.description}</p>
        </header>

        <div className="relative mx-auto max-w-5xl px-0 pb-7 pt-2 md:px-10 lg:px-20">
          <div className="relative rounded-[18px] border-2 border-slate-900/90 bg-white/82 shadow-[0_22px_60px_rgba(15,23,42,0.12)] backdrop-blur dark:border-white/80 dark:bg-slate-950/42 dark:shadow-[0_22px_60px_rgba(0,0,0,0.3)]">
            {sorted.map((item, index) => (
              <article
                key={item.id}
                className={[
                  'relative grid gap-4 px-5 py-7 sm:px-7 md:grid-cols-[150px,1fr,48px] md:items-center md:gap-6 lg:grid-cols-[1fr,48px] lg:pl-28',
                  index > 0 ? 'border-t-2 border-slate-900/90 dark:border-white/80' : '',
                ].join(' ')}
              >
                {(language === 'en' ? item.periodEn ?? item.period : item.period) ? (
                  <div className="md:col-span-1 lg:absolute lg:left-0 lg:top-1/2 lg:-translate-x-[70%] lg:-translate-y-1/2">
                    <span
                      className={[
                        'inline-flex min-h-12 items-center rounded-sm border-2 border-slate-900 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[3px_3px_0_rgba(15,23,42,0.95)] dark:border-white/80',
                        periodStyles[index % periodStyles.length],
                      ].join(' ')}
                    >
                      {language === 'en' ? item.periodEn ?? item.period : item.period}
                    </span>
                  </div>
                ) : null}

                <div className="min-w-0 md:col-span-1 lg:col-span-1">
                  <h3 className="text-balance text-lg font-semibold leading-snug text-slate-950 dark:text-white">
                    {language === 'en' ? item.titleEn ?? item.title : item.title}
                    {item.roleLine ? (
                      <>
                        {' '}
                        {t.companyConnector} <span className="font-bold">{item.roleLine}</span>
                      </>
                    ) : null}
                  </h3>

                  {(language === 'en' ? item.descriptionEn ?? item.description : item.description) ? (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {language === 'en' ? item.descriptionEn ?? item.description : item.description}
                    </p>
                  ) : null}
                </div>

                <div className="flex md:justify-end">
                  <span
                    className={[
                      'grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold shadow-lg',
                      markerStyles[index % markerStyles.length],
                    ].join(' ')}
                    aria-label={`Experiencia ${index + 1}`}
                  >
                    {index + 1}
                  </span>
                </div>
              </article>
            ))}

            <div className="absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2">
              <a
                href="/pdf/cv.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-sm border-2 border-slate-900 bg-gradient-to-r from-cyan-300 via-blue-500 to-orange-400 px-6 py-2 text-sm font-bold text-slate-950 shadow-[4px_4px_0_rgba(15,23,42,0.95)] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_rgba(15,23,42,0.95)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
              >
                {t.cv}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
