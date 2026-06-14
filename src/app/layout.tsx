import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import LayoutChrome from '@/components/LayoutChrome'
import ThemeToggle from '@/components/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

function getMetadataBase() {
  const rawSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000')

  try {
    return new URL(rawSiteUrl)
  } catch {
    try {
      return new URL(`https://${rawSiteUrl.replace(/^\/+|\/+$/g, '')}`)
    } catch {
      return new URL('http://localhost:3000')
    }
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: 'JonisCode',
    template: '%s',
  },
  description:
    'Portafolio de JonisCode con experiencia destacada, tecnologias y proyectos de desarrollo frontend.',
  applicationName: 'JonisCode',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png' }],
    shortcut: [{ url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/icon.png', type: 'image/png' }],
  },
  openGraph: {
    title: 'JonisCode',
    description:
      'Portafolio de JonisCode con experiencia destacada, tecnologias y proyectos de desarrollo frontend.',
    images: ['/images/cover.jpg'],
    type: 'website',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JonisCode',
    description:
      'Portafolio de JonisCode con experiencia destacada, tecnologias y proyectos de desarrollo frontend.',
    images: ['/images/cover.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var ls = localStorage.getItem('theme');
                var prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var isDark = ls ? ls === 'dark' : prefers;
                document.documentElement.classList.toggle('dark', isDark);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`
          ${inter.className}
          min-h-[100dvh]
          bg-white text-slate-900
          transition-colors duration-300
          dark:bg-[#0b1220] dark:text-slate-100
        `}
      >
        <ThemeToggle />
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  )
}
