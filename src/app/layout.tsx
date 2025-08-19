// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import ThemeToggle from '@/components/ThemeToggle'
import SiteFooter from '@/components/SiteFooter'
import AppFrame from '@/components/AppFrame'
import WhatsAppFab from '@/components/WhatsAppFab'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JonisCode',
  description: 'Proyectos y tecnologías',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      {/* Aplica tema antes de hidratar */}
      <Script id="theme-init" strategy="beforeInteractive">
        {`
          try {
            var ls = localStorage.getItem('theme');
            var prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var isDark = ls ? ls === 'dark' : prefers;
            document.documentElement.classList.toggle('dark', isDark);
          } catch (e) {}
        `}
      </Script>

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
        <WhatsAppFab/>
        <AppFrame>{children}</AppFrame>
        <SiteFooter />         {/* oculto en portada según tu HIDDEN_ON */}
      </body>
    </html>
  )
}
