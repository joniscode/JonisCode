'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  label: React.ReactNode
  href: string
  imgSrc: string
  duration?: number
}

export default function PortalButton({ label, href, imgSrc, duration = 0.9 }: Props) {
  const router = useRouter()
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [overlay, setOverlay] = useState(false)

  const handleClick = () => {
    btnRef.current?.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(0.96)' }],
      { duration: 120, easing: 'ease-in-out' }
    )
    setOverlay(true)

    requestAnimationFrame(() => {
      const imgEl = imgRef.current
      if (imgEl) {
        imgEl.animate(
          [
            { transform: 'translate(-50%, -50%) scale(0.25)', opacity: 0.85 },
            { transform: 'translate(-50%, -50%) scale(2.4)', opacity: 0.0 },
          ],
          { duration: duration * 1000, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
        )
      }
      const flashEl = document.getElementById('portal-flash')
      flashEl?.animate(
        [{ opacity: 0 }, { opacity: 0.7 }, { opacity: 0 }],
        { duration: duration * 1000, easing: 'linear', fill: 'forwards' }
      )
    })

    setTimeout(() => {
      router.push(href)
      setOverlay(false)
    }, duration * 1000)
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleClick}
        className="
          relative inline-flex items-center justify-center font-semibold tracking-widest
          border-2 border-white/20 bg-white/5 text-white backdrop-blur
          shadow-[0_0_30px_rgba(255,255,255,.5),0_0_60px_rgba(255,255,255,.2)]
          transition-transform duration-300 hover:scale-105 active:scale-95
          w-[clamp(180px,22vmin,260px)] h-[clamp(260px,32vmin,420px)] rounded-[clamp(40px,8vmin,80px)]
          px-8 py-6
        "
      >
        {label}
      </button>

      {overlay && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <img
            ref={imgRef}
            src={imgSrc}
            alt=""
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-[60vmin] h-[60vmin] object-cover rounded-[40px] shadow-2xl"
          />
          <div id="portal-flash" className="fixed inset-0 bg-white" style={{ opacity: 0 }} />
        </div>
      )}
    </>
  )
}
