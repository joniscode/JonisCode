// components/TechRing.tsx
'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import TechTile from './TechTile'

type Item = string | { slug: string; label?: string; icon?: string }

type Props = {
  items: Item[]
  tiltDeg?: number
  autoSpeed?: number
}

export default function TechRing({ items, tiltDeg = 14, autoSpeed = 0.12 }: Props) {
  const ringRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const [angle, setAngle] = useState(0)
  const velRef = useRef(0)
  const dragRef = useRef<{ dragging: boolean; lastX: number } | null>(null)
  const [radius, setRadius] = useState(360)

  const data = useMemo(
    () =>
      items.map((it) =>
        typeof it === 'string'
          ? { slug: it, label: it }
          : { slug: it.slug, label: it.label ?? it.slug, icon: it.icon }
      ),
    [items]
  )

  const step = 360 / data.length

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      setRadius(Math.round(Math.max(220, Math.min(Math.min(w, h) * 0.32, 520))))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  useEffect(() => {
    let last = performance.now()
    const friction = 0.95
    const tick = (t: number) => {
      const dt = Math.min(32, t - last)
      last = t
      if (!dragRef.current?.dragging) {
        velRef.current *= friction
        setAngle((a) => a + autoSpeed + velRef.current)
      } else {
        setAngle((a) => a + velRef.current)
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => frameRef.current && cancelAnimationFrame(frameRef.current)
  }, [autoSpeed])

  useEffect(() => {
    const el = ringRef.current
    if (!el) return
    const onDown = (e: PointerEvent) => {
      dragRef.current = { dragging: true, lastX: e.clientX }
      el.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      const s = dragRef.current
      if (!s?.dragging) return
      const dx = e.clientX - s.lastX
      s.lastX = e.clientX
      velRef.current = dx * 0.5
    }
    const onUp = (e: PointerEvent) => {
      dragRef.current = { dragging: false, lastX: e.clientX }
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return (
    <div className="relative mx-auto w-full max-w-6xl py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold">
          <span className="text-gradient-gpt">¡Technologies &amp; Tools!</span> 🛠️
        </h2>
        <p className="mt-3 text-base opacity-80">
          Estas son las tecnologías y herramientas con las que he trabajado para crear aplicaciones web
          escalables y de alto rendimiento.
        </p>
      </div>

      <div className="relative mx-auto h-[360px] sm:h-[420px] md:h-[480px] lg:h-[520px] [perspective:1200px]">
        <div
          className="pointer-events-none absolute left-1/2 bottom-8 -translate-x-1/2 blur-2xl"
          style={{
            width: '60%',
            height: '80px',
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 70%)',
          }}
        />
        <div
          ref={ringRef}
          className="absolute inset-0 mx-auto [transform-style:preserve-3d] will-change-transform select-none"
          style={{ transform: `rotateX(${tiltDeg}deg) rotateY(${angle}deg)`, transition: 'transform 60ms linear' }}
        >
          {data.map((it, i) => {
            const rotate = i * step
            return (
              <div
                key={it.slug}
                className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
                style={{ transform: `translate(-50%, -50%) rotateY(${rotate}deg) translateZ(${radius}px)` }}
              >
                {/* ⬇️ ahora pasamos slug para el fallback y usamos .png por defecto */}
                <TechTile label={it.label!} slug={it.slug} icon={it.icon ?? `/icons/${it.slug}.png`} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
