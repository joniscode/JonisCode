'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import PUBLIC_ENV from '@/config/publicEnv'

const ROOT_PATH = '/'
const HOME_PATH = '/home'
const WA_ICON = '/icons/WhatsApp.png'

export default function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ROOT_PATH
  const isLanding = pathname === ROOT_PATH
  const isHome = pathname === HOME_PATH
  const [showBackToTop, setShowBackToTop] = useState(false)
  const phone = PUBLIC_ENV.WHATSAPP_PHONE?.replace(/\D/g, '')
  const whatsappHref = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(PUBLIC_ENV.WHATSAPP_DEFAULT_MSG)}`
    : null

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 280)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {!isLanding ? (
        <button
          type="button"
          aria-label="Volver arriba"
          title="Volver arriba"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={[
            'fixed right-4 z-[9999] hidden h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/78 text-2xl text-white shadow-[0_18px_40px_rgba(2,6,23,0.45)] backdrop-blur transition md:flex',
            whatsappHref ? 'bottom-24' : 'bottom-4',
            showBackToTop
              ? 'pointer-events-auto translate-y-0 opacity-100 animate-vertical-bounce'
              : 'pointer-events-none translate-y-3 opacity-0',
          ].join(' ')}
        >
          <span aria-hidden>↑</span>
        </button>
      ) : null}

      {!isLanding && whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribeme por WhatsApp"
          title="Escribeme por WhatsApp"
          className="fixed bottom-4 right-4 z-[9999] rounded-full bg-green-500 p-3 text-white shadow-lg shadow-green-500/30 transition hover:scale-105 active:scale-95 md:p-4"
        >
          <Image src={WA_ICON} alt="WhatsApp" width={28} height={28} priority={false} />
        </a>
      ) : null}

      <div
        className={
          isLanding ? 'min-h-[100dvh]' : isHome ? '' : 'min-h-[100dvh] md:pb-16'
        }
      >
        {children}
      </div>

      {!isLanding ? (
        <footer
          className={
            isHome
              ? 'relative z-20 border-t border-slate-200/80 bg-white/70 text-sm text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-950/35 dark:text-white/90'
              : 'relative border-t border-slate-200/80 bg-white/70 text-sm text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-950/35 dark:text-white/90 md:fixed md:bottom-0 md:left-0 md:right-0 md:z-40'
          }
        >
          <div className="flex h-14 items-center md:h-16">
            <div className="container mx-auto flex w-full items-center justify-center px-4">
              <Link href={HOME_PATH} className="hover:underline">
                <span>JonisCode.com © {new Date().getFullYear()}</span>
              </Link>
            </div>
          </div>
        </footer>
      ) : null}
    </>
  )
}
