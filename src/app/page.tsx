'use client'

import Image from 'next/image'
import type { RefObject } from 'react'
import { useEffect, useRef, useState, startTransition } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import BrandLoader from '@/components/BrandLoader'
import ConstellationBackground from '@/components/ConstellationBackground'

const HOME_REVEAL_KEY = 'joniscode-home-reveal'
const HOME_REVEAL_ORIGIN_KEY = 'joniscode-home-reveal-origin'

function CoverScreen({
  buttonRef,
  onEnter,
  disabled,
}: {
  buttonRef: RefObject<HTMLButtonElement | null>
  onEnter: () => void
  disabled: boolean
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050814]">
      <Image
        src="/images/cover.jpg"
        alt="Portada de ingreso al portafolio JonisCode"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(19,176,245,0.16),transparent_34%),linear-gradient(180deg,rgba(5,8,20,0.12)_0%,rgba(5,8,20,0.36)_38%,rgba(5,8,20,0.68)_100%)]" />
      <div className="absolute inset-0 bg-black/22" />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <button
          ref={buttonRef}
          onClick={onEnter}
          disabled={disabled}
          aria-busy={disabled}
          className="group inline-flex items-center gap-3 rounded-2xl border border-white/55 bg-slate-950/30 px-8 py-4 text-white shadow-[0_20px_50px_rgba(5,8,20,0.35)] backdrop-blur-xl transition hover:bg-white/18 hover:shadow-[0_24px_60px_rgba(5,8,20,0.45)] focus:outline-none focus:ring-2 focus:ring-cyan-300/70 disabled:cursor-wait disabled:opacity-80"
        >
          <span className="text-lg font-semibold uppercase tracking-wider">Entrar</span>
          <svg
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12h14M13 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 mx-auto max-w-7xl px-4 text-center text-white/80">
        <p className="text-sm">© {new Date().getFullYear()} JonisCode • Portafolio</p>
      </div>
    </div>
  )
}

export default function Page() {
  const [isNavigating, setIsNavigating] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const navigateTimeoutRef = useRef<number | null>(null)
  const fallbackTimeoutRef = useRef<number | null>(null)
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    router.prefetch('/home')
    return () => {
      if (navigateTimeoutRef.current !== null) window.clearTimeout(navigateTimeoutRef.current)
      if (fallbackTimeoutRef.current !== null) window.clearTimeout(fallbackTimeoutRef.current)
    }
  }, [router])

  const storeRevealOrigin = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    const fallback = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : fallback

    window.sessionStorage.setItem(HOME_REVEAL_KEY, '1')
    window.sessionStorage.setItem(HOME_REVEAL_ORIGIN_KEY, JSON.stringify(origin))
  }

  const handleEnter = () => {
    if (isNavigating) return

    storeRevealOrigin()

    if (prefersReducedMotion) {
      startTransition(() => {
        router.replace('/home')
      })

      fallbackTimeoutRef.current = window.setTimeout(() => {
        if (window.location.pathname !== '/home') {
          window.location.assign('/home')
        }
      }, 350)

      return
    }

    setIsNavigating(true)

    navigateTimeoutRef.current = window.setTimeout(() => {
      startTransition(() => {
        router.replace('/home')
      })

      fallbackTimeoutRef.current = window.setTimeout(() => {
        if (window.location.pathname !== '/home') {
          window.location.assign('/home')
        }
      }, 500)
    }, 140)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 dark:bg-[#060812]">
      <motion.div
        initial={false}
        animate={
          isNavigating
            ? { opacity: 0.18, scale: 1.02, filter: 'blur(5px) brightness(0.78)' }
            : { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)' }
        }
        transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <CoverScreen buttonRef={buttonRef} onEnter={handleEnter} disabled={isNavigating} />
      </motion.div>

      <AnimatePresence>
        {isNavigating && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          >
            <div aria-hidden className="absolute inset-0">
              <ConstellationBackground interactive={false} quality="lite" />
            </div>

            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(19,176,245,0.16) 0%, rgba(10,18,35,0.82) 34%, rgba(4,9,20,0.94) 68%, rgba(4,9,20,1) 100%)',
              }}
            />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,9,20,0.34)_0%,rgba(4,9,20,0.08)_28%,rgba(4,9,20,0.22)_65%,rgba(4,9,20,0.68)_100%)]" />

            <div className="relative z-10 flex min-h-screen items-center justify-center">
              <BrandLoader label="Abriendo vista" size={140} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
