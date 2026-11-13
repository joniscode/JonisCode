'use client'

import CaseDiagram from './CaseDiagram'
import { SectionIntro, SectionTitle } from './Sections'
import { useLanguage } from './LanguageProvider'
import { CASES, CASES_COPY } from '@/data/site'

export default function Cases() {
  const { language } = useLanguage()
  const t = CASES_COPY[language]

  return (
    <>
      <SectionIntro id="work" word={t.word}>
        <SectionTitle title={t.title} intro={t.intro} />
      </SectionIntro>

      <div className="relative bg-bg">
        {CASES.map((item, index) => (
          <article key={item.id} className="border-t border-ink/15 py-20 first:border-t-0 lg:py-28">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1fr,1.05fr] lg:gap-16">
              <div>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-wider text-muted">
                  <span className="text-accent">
                    {String(index + 1).padStart(2, '0')} / {String(CASES.length).padStart(2, '0')}
                  </span>
                  <span>{item.period[language]}</span>
                  <span>· {item.sector[language]}</span>
                </p>

                <h3 className="mt-5 text-balance text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
                  {item.title[language]}
                </h3>
                <p className="mt-4 text-base text-ink/80">
                  {item.role[language]} · <span className="font-bold text-ink">{item.company}</span>
                </p>

                <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{t.challenge}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-ink/85">{item.challenge[language]}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{t.work}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-ink/85">{item.work[language]}</dd>
                  </div>
                </dl>

                <ul className="mt-8 flex flex-wrap gap-2">
                  {item.stack.map((tech) => (
                    <li key={tech} className="rounded-full border border-ink/20 px-3 py-1 font-mono text-xs text-ink/80">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="rounded-2xl border border-ink/10 bg-surface p-5 sm:p-8">
                  <CaseDiagram kind={item.diagram} language={language} />
                </div>

                <ul className="mt-6 grid grid-cols-2 gap-6">
                  {item.metrics.map((metric) => (
                    <li key={metric.value + metric.label.en}>
                      <span className="block text-3xl font-extrabold tracking-tight sm:text-4xl">{metric.value}</span>
                      <span className="mt-1 block text-sm text-muted">{metric.label[language]}</span>
                      {metric.example ? (
                        <span className="mt-2 inline-block rounded border border-dashed border-warn/70 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-warn">
                          {t.example}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
