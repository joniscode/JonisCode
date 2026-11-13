'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import MaskReveal from './MaskReveal'
import { useLanguage } from './LanguageProvider'
import PUBLIC_ENV from '@/config/publicEnv'
import {
  CONTACT,
  EDUCATION,
  EDUCATION_COPY,
  LAB,
  LAB_COPY,
  LINKS,
  PROFILE,
  STACK,
  STACK_COPY,
} from '@/data/site'

const SECTION_ORDER = ['work', 'stack', 'education', 'lab', 'contact']

/** Entrada de sección: la misma transición del hero, con el nombre de la sección como recorte. */
export function SectionIntro({ id, word, children }: { id: string; word: string; children: ReactNode }) {
  const index = SECTION_ORDER.indexOf(id)

  return (
    <MaskReveal
      id={id}
      lines={[word]}
      seed={11 + index * 6}
      before={
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
          {String(index + 1).padStart(2, '0')} / {String(SECTION_ORDER.length).padStart(2, '0')}
        </p>
      }
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </MaskReveal>
  )
}

export function SectionTitle({ title, intro }: { title: string; intro?: string }) {
  return (
    <>
      <p className="max-w-4xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
        {title}
      </p>
      {intro ? <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/80 sm:text-xl">{intro}</p> : null}
    </>
  )
}

function SectionShell({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  intro?: string
  children: ReactNode
}) {
  return (
    <>
      <SectionIntro id={id} word={eyebrow}>
        <SectionTitle title={title} intro={intro} />
      </SectionIntro>
      <div className="relative bg-bg">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">{children}</div>
      </div>
    </>
  )
}

export function Stack() {
  const { language } = useLanguage()
  const t = STACK_COPY[language]

  return (
    <SectionShell id="stack" eyebrow={t.eyebrow} title={t.title}>
      <dl>
        {STACK.map((row) => (
            <div key={row.group.en} className="grid gap-3 border-t border-ink/10 py-6 sm:grid-cols-[220px,1fr] sm:gap-8 sm:py-8">
              <dt className="pt-1.5 font-mono text-xs uppercase tracking-wider text-muted">{row.group[language]}</dt>
              <dd className="flex flex-wrap gap-x-6 gap-y-2 text-xl font-bold tracking-tight sm:text-3xl">
                {row.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </dd>
            </div>
        ))}
      </dl>
    </SectionShell>
  )
}

export function Education() {
  const { language } = useLanguage()
  const t = EDUCATION_COPY[language]

  return (
    <SectionShell id="education" eyebrow={t.eyebrow} title={t.title}>
      <ul>
        {EDUCATION.map((item) => (
          <li key={item.title.en}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group grid gap-2 border-t border-ink/10 py-6 sm:grid-cols-[1fr,auto] sm:items-center sm:gap-8"
              >
                <span>
                  <span className="block text-lg font-bold tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                    {item.title[language]}
                  </span>
                  <span className="mt-1 block font-mono text-xs uppercase tracking-wider text-muted">
                    {item.school} · {item.period[language]}
                  </span>
                </span>
                <span
                  className={[
                    'inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider',
                    item.done ? 'border-ink/20 text-ink/70' : 'border-accent/60 text-accent',
                  ].join(' ')}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${item.done ? 'bg-ink/50' : 'bg-accent'}`} />
                  {item.done ? t.completed : t.inProgress}
                </span>
              </a>
          </li>
        ))}
      </ul>
      <p className="border-t border-ink/10 pt-6 text-sm text-muted">{t.footnote}</p>
    </SectionShell>
  )
}

export function Lab() {
  const { language } = useLanguage()
  const t = LAB_COPY[language]

  return (
    <SectionShell id="lab" eyebrow={t.eyebrow} title={t.title} intro={t.intro}>
      <ul className="grid gap-x-12 md:grid-cols-2">
        {LAB.map((project) => (
          <li key={project.name}>
            <a
              href={project.href}
              target={project.download ? undefined : '_blank'}
              rel={project.download ? undefined : 'noreferrer'}
              download={project.download ? true : undefined}
              className="group flex h-full items-start justify-between gap-6 border-t border-ink/10 py-6"
            >
              <span>
                <span className="block text-lg font-bold tracking-tight transition-colors group-hover:text-accent sm:text-xl">
                  {project.name}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-muted">{project.description[language]}</span>
              </span>
              <span className="flex shrink-0 items-center gap-3 pt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                {project.tech}
                <span aria-hidden className="text-base text-ink transition-transform group-hover:translate-x-1 group-hover:text-accent">
                  {project.download ? '↓' : '↗'}
                </span>
                {project.download ? <span className="sr-only">{t.download}</span> : null}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </SectionShell>
  )
}

function ContactLink({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  const external = href.startsWith('http')

  return (
    <a
      href={href}
      target={external || href.endsWith('.pdf') ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={[
        'inline-flex h-12 items-center rounded-full px-6 text-sm font-bold transition-colors',
        primary ? 'bg-accent text-bg hover:bg-ink' : 'border border-ink/30 hover:border-accent hover:text-accent',
      ].join(' ')}
    >
      {children}
    </a>
  )
}

export function Contact() {
  const { language } = useLanguage()
  const t = CONTACT[language]
  const email = PUBLIC_ENV.CONTACT_EMAIL
  const phone = PUBLIC_ENV.WHATSAPP_PHONE.replace(/\D/g, '')
  const whatsappHref = `https://wa.me/${phone}?text=${encodeURIComponent(PUBLIC_ENV.WHATSAPP_DEFAULT_MSG)}`

  return (
    <>
      <SectionIntro id="contact" word={t.eyebrow}>
        <div className="flex flex-col-reverse gap-8 md:flex-row md:items-end md:justify-between">
          <p className="text-[clamp(3.5rem,13vw,10rem)] font-black leading-[0.9] tracking-tight">{t.title}</p>
          <Image
            src="/images/profile-illustration.png"
            alt={t.portraitAlt}
            width={176}
            height={176}
            className="h-24 w-24 rounded-2xl object-cover object-top sm:h-44 sm:w-44"
          />
        </div>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/85 sm:text-xl">{t.copy}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {email ? (
            <ContactLink href={`mailto:${email}`} primary>
              {t.email}
            </ContactLink>
          ) : null}
          <ContactLink href={LINKS.linkedin} primary={!email}>
            LinkedIn
          </ContactLink>
          <ContactLink href={LINKS.github}>GitHub</ContactLink>
          <ContactLink href={whatsappHref}>{t.whatsapp}</ContactLink>
          <ContactLink href={LINKS.cv}>{t.cv}</ContactLink>
        </div>
      </SectionIntro>

      <footer className="relative border-t border-ink/10 bg-bg">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-6 font-mono text-xs text-muted sm:px-8">
          <span>
            © {new Date().getFullYear()} {PROFILE.name} · {PROFILE.brand}
          </span>
          <span>{PROFILE.location}</span>
        </div>
      </footer>
    </>
  )
}
