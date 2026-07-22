'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const ROOT_PATH = '/'
const HOME_PATH = '/home'

export default function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ROOT_PATH
  const isLanding = pathname === ROOT_PATH
  const isHome = pathname === HOME_PATH
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const shouldShow = window.scrollY > 280
      setShowBackToTop((current) => (current === shouldShow ? current : shouldShow))
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
            'fixed right-4 z-[10002] hidden h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/35 bg-white/92 text-slate-950 shadow-[0_18px_40px_rgba(15,23,42,0.24)] backdrop-blur transition dark:border-white/10 dark:bg-slate-950/78 dark:text-white dark:shadow-[0_18px_40px_rgba(2,6,23,0.45)] md:flex',
            'bottom-4',
            showBackToTop
              ? 'pointer-events-auto translate-y-0 opacity-100 animate-vertical-bounce'
              : 'pointer-events-none translate-y-3 opacity-0',
          ].join(' ')}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none">
            <path d="M12 19V5m0 0-6 6m6-6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
          </svg>
        </button>
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
