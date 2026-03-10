import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThemeToggle from '@/components/ThemeToggle'
import SiteFooter from '@/components/SiteFooter'
import AppFrame from '@/components/AppFrame'
import WhatsAppFab from '@/components/WhatsAppFab'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JonisCode',
  description: 'Proyectos y tecnologias',
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
        className={`
          ${inter.className}
          min-h-[100svh]
          bg-white text-slate-900
          transition-colors duration-300
          dark:bg-[#0b1220] dark:text-slate-100
        `}
      >
        <ThemeToggle />
        <WhatsAppFab />
        <AppFrame>{children}</AppFrame>
        <SiteFooter />
      </body>
    </html>
  )
}
