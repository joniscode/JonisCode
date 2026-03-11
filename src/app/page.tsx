'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function CoverScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
    >
      <Image
        src="/images/cover.jpg"
        alt="Portada de JonisCode"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <button
          onClick={onEnter}
          className="group inline-flex items-center gap-3 rounded-2xl border border-white/50 bg-white/10 px-8 py-4 text-white backdrop-blur-md transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
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
  const [startOpen, setStartOpen] = useState(false)
  const router = useRouter()

  const handleEnter = () => setStartOpen(true)
  const handleOverlayComplete = () => {
    if (startOpen) {
      router.push('/home')
    }
  }

  return (
    <div className="relative min-h-screen">
      <CoverScreen onEnter={handleEnter} />

      <AnimatePresence>
        {startOpen && (
          <motion.div
            key="portal"
            className="pointer-events-none absolute inset-0 z-20"
            initial={{ clipPath: 'circle(0% at 50% 60%)' }}
            animate={{ clipPath: 'circle(140% at 50% 60%)' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={handleOverlayComplete}
          >
            <div
              className="relative h-full w-full"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(10,10,20,1) 0%, rgba(0,0,0,1) 70%)',
                filter: 'brightness(0.9)',
              }}
            >
              {Array.from({ length: 40 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute h-[2px] w-[2px] rounded-full bg-white/90 animate-[twinkle_2s_ease-in-out_infinite]"
                  style={{
                    top: `${(i * 53) % 100}%`,
                    left: `${(i * 37) % 100}%`,
                    opacity: 0.6 + (i % 5) * 0.08,
                    animationDelay: `${(i % 10) * 0.15}s`,
                  }}
                />
              ))}
            </div>

            <style jsx global>{`
              @keyframes twinkle {
                0%,
                100% {
                  transform: scale(1);
                  opacity: 0.6;
                }
                50% {
                  transform: scale(1.8);
                  opacity: 1;
                }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
