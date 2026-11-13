import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Archivo, JetBrains_Mono } from 'next/font/google'
import { LanguageProvider } from '@/components/LanguageProvider'
import THEME from '@/config/theme'
import { META, PROFILE } from '@/data/site'

const sans = Archivo({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

const TITLE = META.title
const DESCRIPTION = META.description

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
  title: TITLE,
  description: DESCRIPTION,
  applicationName: PROFILE.brand,
  authors: [{ name: PROFILE.name }],
  manifest: '/manifest.webmanifest',
  alternates: { canonical: '/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'es_CO',
    siteName: PROFILE.brand,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
}

export const viewport: Viewport = {
  themeColor: THEME.bg,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-[100dvh] font-sans">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
