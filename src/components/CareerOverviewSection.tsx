'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useLanguage } from './LanguageProvider'
import PUBLIC_ENV from '@/config/publicEnv'
import careerOverviewCopy from '@/data/careerOverview.json'

const PROFILE_IMAGE = '/images/profile-illustration.png'
const GITHUB_URL = 'https://github.com/joniscode'
const LINKEDIN_URL = 'https://www.linkedin.com/in/jonathan--arevalo/'

const COPY = careerOverviewCopy

const LEARNING = [
  { label: 'Python', icon: '/icons/python.png' },
  { label: 'Java', icon: '/icons/java.png' },
  { label: 'AWS', icon: '/icons/aws.png' },
  { label: 'Linux', icon: '/icons/linux.png' },
]

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12.04 2a9.86 9.86 0 0 0-8.43 14.95L2.5 22l5.18-1.08A9.95 9.95 0 1 0 12.04 2Zm0 1.88a8.07 8.07 0 1 1-4.05 15.06l-.32-.18-3.04.64.65-2.96-.2-.34a8.07 8.07 0 0 1 6.96-12.22Zm-3.5 3.78c-.18 0-.46.07-.7.34-.24.27-.92.9-.92 2.18 0 1.29.94 2.53 1.07 2.7.13.18 1.82 2.92 4.5 3.98 2.23.88 2.68.71 3.16.66.49-.04 1.57-.64 1.79-1.26.22-.62.22-1.15.15-1.26-.07-.11-.24-.18-.51-.31-.26-.13-1.57-.78-1.82-.87-.24-.09-.42-.13-.6.13-.17.27-.68.87-.84 1.04-.15.18-.31.2-.57.07-.27-.13-1.12-.41-2.13-1.31-.79-.7-1.32-1.57-1.48-1.84-.15-.26-.02-.41.12-.54.12-.12.27-.31.4-.46.13-.16.18-.27.27-.45.09-.18.04-.33-.02-.46-.07-.13-.6-1.45-.82-1.98-.22-.52-.44-.45-.6-.46h-.51Z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.19-3.37-1.19-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.57 9.57 0 0 1 12 6.99c.85 0 1.7.11 2.5.34 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9.75h4v10.5H3V9.75Zm6.25 0h3.83v1.43h.05c.54-1 1.83-1.68 3.56-1.68 3.81 0 4.51 2.51 4.51 5.77v4.98h-4v-4.41c0-1.05-.02-2.41-1.47-2.41-1.47 0-1.7 1.15-1.7 2.33v4.49h-3.98V9.75Z" />
    </svg>
  )
}

function SocialButton({
  href,
  icon,
  children,
}: {
  href: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-9 items-center gap-2 rounded-sm border-2 border-slate-950 bg-cyan-300 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-[4px_4px_0_rgba(15,23,42,0.95)] transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-[6px_6px_0_rgba(15,23,42,0.95)] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
    >
      {icon}
      {children}
    </a>
  )
}

function StudiesMarquee({ studies }: { studies: readonly string[][] }) {
  const marqueeStudies = [...studies, ...studies]

  return (
    <div className="mt-8 overflow-hidden border-y border-cyan-500/25 py-4 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
      <ol className="flex w-max animate-study-marquee gap-4">
        {marqueeStudies.map(([title, detail], index) => (
          <li
            key={`${title}-${index}`}
            className="flex min-h-[76px] w-[280px] shrink-0 items-center rounded-sm border border-cyan-500/25 bg-white/88 p-3 text-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:bg-slate-950/50 dark:text-white"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold leading-5">{title}</span>
              <span className="block text-xs text-slate-600 dark:text-cyan-100/75">{detail}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function CareerOverviewSection() {
  const { language } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = COPY[language]
  const phone = PUBLIC_ENV.WHATSAPP_PHONE?.replace(/\D/g, '')
  const whatsappHref = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(PUBLIC_ENV.WHATSAPP_DEFAULT_MSG)}`
    : '#'

  return (
    <section
      id="home"
      className="relative min-h-[calc(100dvh-1px)] overflow-hidden bg-white text-slate-950 dark:bg-[#040914] dark:text-slate-100"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-65 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.28) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      <header className="fixed left-0 right-0 top-0 z-[10000] border-b border-slate-200/70 bg-white/86 backdrop-blur-xl dark:border-white/10 dark:bg-[#040914]/82">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 pr-28 sm:px-6 sm:pr-32 lg:px-8 lg:pr-36">
          <a href="#home" className="inline-flex items-center gap-2 text-2xl font-black">
            <Image src="/images/Logo.png" alt="" width={34} height={34} className="h-8 w-8 object-contain" />
            <span>JonisCode</span>
          </a>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-950/[0.06] text-slate-950 transition hover:bg-cyan-300/20 dark:bg-white/[0.08] dark:text-white dark:hover:bg-cyan-300/10 md:hidden"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path
                d={isMenuOpen ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'}
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2.2"
              />
            </svg>
          </button>

          <nav aria-label="Main sections" className="hidden items-center gap-x-4 gap-y-2 text-sm font-medium md:flex sm:gap-x-5">
            <a className="hover:text-cyan-500" href="#home">{t.nav.home}</a>
            <a className="hover:text-cyan-500" href="#portfolio">{t.nav.portfolio}</a>
            <a className="hover:text-cyan-500" href="#tools">{t.nav.tools}</a>
            <a className="hover:text-cyan-500" href="#experience">{t.nav.experience}</a>
          </nav>

          {isMenuOpen ? (
            <nav
              aria-label="Mobile sections"
              className="absolute left-4 right-28 top-[calc(100%+8px)] z-[10003] flex flex-col rounded-sm bg-white/95 p-2 text-sm font-bold text-slate-950 shadow-[0_18px_50px_rgba(15,23,42,0.22)] backdrop-blur dark:bg-slate-950/95 dark:text-white md:hidden"
            >
              <a className="px-3 py-2 hover:text-cyan-500" href="#home" onClick={() => setIsMenuOpen(false)}>{t.nav.home}</a>
              <a className="px-3 py-2 hover:text-cyan-500" href="#portfolio" onClick={() => setIsMenuOpen(false)}>{t.nav.portfolio}</a>
              <a className="px-3 py-2 hover:text-cyan-500" href="#tools" onClick={() => setIsMenuOpen(false)}>{t.nav.tools}</a>
              <a className="px-3 py-2 hover:text-cyan-500" href="#experience" onClick={() => setIsMenuOpen(false)}>{t.nav.experience}</a>
            </nav>
          ) : null}
        </div>
      </header>

      <div className="relative mx-auto flex min-h-[100dvh] max-w-7xl flex-col px-4 pb-5 pt-28 sm:px-6 sm:pt-24 lg:min-h-[calc(100dvh-56px)] lg:px-8 lg:pt-16">
        <div className="grid flex-1 items-center gap-8 py-10 lg:flex-none lg:grid-cols-[0.9fr,1.1fr] lg:gap-12 lg:py-8">
          <div className="space-y-8 md:flex md:flex-row-reverse md:items-center md:justify-between md:gap-8 md:space-y-0 lg:block lg:space-y-8">
            <div className="relative mx-auto w-fit animate-profile-float md:mx-0 md:-translate-x-36 lg:translate-x-0">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-slate-950 bg-white shadow-[5px_5px_0_rgba(15,23,42,0.95)] sm:h-40 sm:w-40">
                <Image src={PROFILE_IMAGE} alt="Jonathan Arevalo serious caricature illustration" fill priority className="object-cover" />
                <span className="pointer-events-none absolute inset-y-[-12%] left-0 w-10 animate-profile-shine bg-white/35 blur-sm" />
              </div>
              <span className="absolute -right-24 top-4 rotate-[-9deg] bg-cyan-300 px-3 py-1 text-xl font-black text-slate-950 shadow-sm">
                Jonathan
              </span>
            </div>

            <div>
              <h1 className="max-w-xl text-5xl font-black leading-[0.98] sm:text-6xl lg:text-7xl">
                {t.headline}
              </h1>
              <div className="mt-2 h-4 w-64 max-w-full bg-gradient-to-r from-cyan-300 via-blue-500 to-orange-400 sm:w-80" />
            </div>

          </div>

          <div className="space-y-6 lg:pt-8">
            <div className="max-w-2xl space-y-4 text-lg leading-8 text-slate-800 dark:text-slate-200 sm:text-xl">
              <p>{t.summary}</p>
              <p className="text-base leading-7 opacity-80">{t.detail}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <SocialButton href={whatsappHref} icon={<WhatsAppIcon />}>{t.contact}</SocialButton>
              <SocialButton href={GITHUB_URL} icon={<GitHubIcon />}>GitHub</SocialButton>
              <SocialButton href={LINKEDIN_URL} icon={<LinkedInIcon />}>LinkedIn</SocialButton>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">{t.location}</p>

            <div className="rounded-sm border-l-4 border-orange-400 bg-cyan-50/80 p-4 dark:bg-cyan-950/20">
              <h3 className="text-lg font-black text-slate-950 dark:text-white">{t.learningTitle}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{t.learningCopy}</p>
              <ul className="mt-4 flex flex-wrap gap-3">
                {LEARNING.map((item) => (
                  <li key={item.label} className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-white px-3 py-2 text-sm font-bold text-slate-950 dark:bg-slate-950/60 dark:text-white">
                    <Image src={item.icon} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 180 120"
          className="pointer-events-none absolute left-[29%] top-[58%] hidden h-28 w-40 text-slate-950 dark:text-white lg:block"
        >
          <path
            d="M158 22c-34 8-63 23-75 44-10 18 15 22 21 5 5-15-15-21-32-8-15 12-29 20-51 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5"
          />
          <path
            d="M29 76 15 89l19 7"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5"
          />
        </svg>

        <div className="pb-8 lg:-mt-2">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <p className="text-xl font-medium text-slate-950 dark:text-white">{t.years}</p>
          </div>
          <StudiesMarquee studies={t.studies} />
        </div>
      </div>
    </section>
  )
}
