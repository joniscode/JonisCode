'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import { useLanguage } from './LanguageProvider'
import PUBLIC_ENV from '@/config/publicEnv'

const PROFILE_IMAGE = '/images/profile-illustration.png'
const GITHUB_URL = 'https://github.com/joniscode'
const LINKEDIN_URL = 'https://www.linkedin.com/in/jonathan--arevalo/'

const COPY = {
  en: {
    nav: {
      home: 'Home',
      studies: 'Studies',
      portfolio: 'Portfolio',
      tools: 'Tools',
      experience: 'Experience',
    },
    headline: 'Frontend Developer',
    summary:
      'I am Jonathan Arevalo, a Front-End Developer from Colombia. I build clean, reusable and scalable web experiences with React, Next.js, Angular, TypeScript and Tailwind CSS.',
    detail:
      'My focus is frontend architecture, microfrontends, ecommerce, automation and integrations that turn ideas into maintainable digital products.',
    years: '+5 years of experience',
    location: 'Bogotá - Colombia',
    contact: 'Contact me',
    studiesTitle: 'Studies',
    learningTitle: 'Current studies',
    learningCopy:
      'I am strengthening my backend and cloud profile with Python, Java and AWS, while keeping Linux as part of my daily technical workflow.',
    studies: [
      ['Specialization in Artificial Intelligence', 'In progress'],
      ['Systems Engineering', '2025'],
      ['Technologist in Analysis and Development of Information Systems', '2023'],
      ['Full Stack Junior Java Bootcamp', 'In progress'],
      ['Basic Artificial Intelligence Bootcamp', '2025'],
    ],
  },
  es: {
    nav: {
      home: 'Inicio',
      studies: 'Estudios',
      portfolio: 'Portafolio',
      tools: 'Herramientas',
      experience: 'Experiencia',
    },
    headline: 'Desarrollador Frontend',
    summary:
      'Soy Jonathan Arevalo, desarrollador Front-End de Colombia. Construyo experiencias web limpias, reutilizables y escalables con React, Next.js, Angular, TypeScript y Tailwind CSS.',
    detail:
      'Me enfoco en arquitectura frontend, microfrontends, ecommerce, automatización e integraciones que convierten ideas en productos digitales mantenibles.',
    years: '+5 años de experiencia',
    location: 'Bogotá - Colombia',
    contact: 'Contáctame',
    studiesTitle: 'Estudios',
    learningTitle: 'Estudios actuales',
    learningCopy:
      'Estoy fortaleciendo mi perfil backend y cloud con Python, Java y AWS, manteniendo Linux como parte de mi flujo técnico diario.',
    studies: [
      ['Especialización en Inteligencia Artificial', 'En curso'],
      ['Ingeniería de Sistemas', '2025'],
      ['Tecnólogo en Análisis y Desarrollo de Sistemas de Información', '2023'],
      ['Bootcamp Full Stack Junior Java', 'En curso'],
      ['Bootcamp de Inteligencia Artificial Básico', '2025'],
    ],
  },
} as const

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

function StudiesMarquee({ studies }: { studies: readonly (readonly [string, string])[] }) {
  const marqueeStudies = [...studies, ...studies]

  return (
    <div className="mt-8 overflow-hidden border-y border-cyan-500/25 py-4 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
      <ol className="flex w-max animate-study-marquee gap-4">
        {marqueeStudies.map(([title, detail], index) => (
          <li
            key={`${title}-${index}`}
            className="flex min-h-[76px] w-[280px] shrink-0 items-center gap-3 rounded-sm border border-cyan-500/25 bg-white/88 p-3 text-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:bg-slate-950/50 dark:text-white"
          >
            <span aria-hidden className="h-8 w-8 shrink-0 rounded-full border border-cyan-500/25 bg-cyan-300/20" />
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
  const t = COPY[language]
  const phone = PUBLIC_ENV.WHATSAPP_PHONE?.replace(/\D/g, '')
  const whatsappHref = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(PUBLIC_ENV.WHATSAPP_DEFAULT_MSG)}`
    : '#'

  return (
    <section
      id="home"
      className="relative z-10 min-h-[calc(100dvh-1px)] overflow-hidden bg-white text-slate-950 dark:bg-[#040914] dark:text-slate-100"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-65 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.28) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/70 bg-white/86 backdrop-blur-xl dark:border-white/10 dark:bg-[#040914]/82">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-3 pr-28 sm:flex-row sm:items-center sm:px-6 sm:pr-32 lg:px-8 lg:pr-36">
          <a href="#home" className="inline-flex items-center gap-2 text-2xl font-black">
            <Image src="/images/Logo.png" alt="" width={34} height={34} className="h-8 w-8 object-contain" />
            <span>JonisCode</span>
          </a>

          <nav aria-label="Main sections" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium sm:gap-x-5">
            <a className="hover:text-cyan-500" href="#home">{t.nav.home}</a>
            <a className="hover:text-cyan-500" href="#portfolio">{t.nav.portfolio}</a>
            <a className="hover:text-cyan-500" href="#tools">{t.nav.tools}</a>
            <a className="hover:text-cyan-500" href="#experience">{t.nav.experience}</a>
          </nav>
        </div>
      </header>

      <div className="relative mx-auto flex min-h-[100dvh] max-w-7xl flex-col px-4 pb-5 pt-28 sm:px-6 sm:pt-24 lg:min-h-[calc(100dvh-56px)] lg:px-8 lg:pt-16">
        <div className="grid flex-1 items-center gap-8 py-10 lg:flex-none lg:grid-cols-[0.9fr,1.1fr] lg:gap-12 lg:py-8">
          <div className="space-y-8">
            <div className="relative w-fit">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-slate-950 bg-white shadow-[5px_5px_0_rgba(15,23,42,0.95)] sm:h-32 sm:w-32">
                <Image src={PROFILE_IMAGE} alt="Jonathan Arevalo serious caricature illustration" fill priority className="object-cover" />
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

        <div className="pb-8 lg:-mt-2">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <p className="text-xl font-medium text-slate-950 dark:text-white">{t.years}</p>
            <svg aria-hidden="true" viewBox="0 0 120 70" className="hidden h-16 w-28 -translate-x-16 text-slate-950 dark:text-white lg:block">
              <path d="M96 12c-20 6-36 16-46 33-7 13 11 15 17 3 4-8-5-18-17-9-12 9-22 14-36 16" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M18 46 9 56l13 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <StudiesMarquee studies={t.studies} />
        </div>
      </div>
    </section>
  )
}
