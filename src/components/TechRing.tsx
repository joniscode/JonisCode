'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import TechTile from './TechTile'

type Item = string | { slug: string; label?: string; icon?: string }

type Props = {
  items: Item[]
  tiltDeg?: number
  autoSpeed?: number
}

export default function TechRing({ items, tiltDeg = 12, autoSpeed = 0.18 }: Props) {
  const ringRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const dragRef = useRef<{ dragging: boolean; lastX: number } | null>(null)
  const velocityRef = useRef(0)
  const angleRef = useRef(0)
  const [radius, setRadius] = useState(260)

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
  const lift = Math.round(Math.min(64, radius * 0.22))

  useEffect(() => {
    const el = ringRef.current
    if (!el) return

    el.style.transform = `translateY(-${lift}px) rotateX(${tiltDeg}deg) rotateY(${angleRef.current}deg)`
  }, [lift, tiltDeg])

  useEffect(() => {
    const updateRadius = () => {
      const w = window.innerWidth
      if (w < 640) {
        setRadius(170)
      } else if (w < 1024) {
        setRadius(205)
      } else {
        setRadius(260)
      }
    }

    updateRadius()
    window.addEventListener('resize', updateRadius)
    return () => window.removeEventListener('resize', updateRadius)
  }, [])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const tick = () => {
      if (document.visibilityState !== 'visible') {
        frameRef.current = requestAnimationFrame(tick)
        return
      }

      if (!dragRef.current?.dragging && !motionQuery.matches) {
        velocityRef.current *= 0.96
        angleRef.current += autoSpeed + velocityRef.current
      } else {
        angleRef.current += velocityRef.current
      }

      const el = ringRef.current
      if (el) {
        el.style.transform = `translateY(-${lift}px) rotateX(${tiltDeg}deg) rotateY(${angleRef.current}deg)`
      }

      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [autoSpeed, lift, tiltDeg])

  useEffect(() => {
    const el = ringRef.current
    if (!el) return

    const onDown = (event: PointerEvent) => {
      dragRef.current = { dragging: true, lastX: event.clientX }
      el.setPointerCapture(event.pointerId)
    }

    const onMove = (event: PointerEvent) => {
      const state = dragRef.current
      if (!state?.dragging) return

      const delta = event.clientX - state.lastX
      state.lastX = event.clientX
      velocityRef.current = delta * 0.12
    }

    const onUp = (event: PointerEvent) => {
      dragRef.current = { dragging: false, lastX: event.clientX }
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
    <div className="relative mx-auto w-full max-w-6xl pt-6 sm:pt-4">
      <div className="mb-8 text-center sm:mb-10">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          <span className="text-gradient-gpt">Technologies &amp; Tools</span> 🛠️
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-sm opacity-80 sm:text-base">
          Estas son las tecnologias y herramientas con las que he trabajado para crear aplicaciones web
          escalables y de alto rendimiento.
        </p>
      </div>

      <div className="relative px-4 pb-0 pt-6 sm:px-6 sm:pb-0 sm:pt-8">
        <div className="relative mx-auto h-[320px] [perspective:1400px] sm:h-[380px] lg:h-[440px]">
          <div
            className="pointer-events-none absolute bottom-6 left-1/2 h-20 w-[58%] -translate-x-1/2 blur-2xl"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 70%)',
            }}
          />

          <div
            ref={ringRef}
            className="absolute inset-0 mx-auto select-none [transform-style:preserve-3d] will-change-transform"
          >
            {data.map((item, index) => (
              <div
                key={item.slug}
                className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
                style={{
                  transform: `translate(-50%, -50%) rotateY(${index * step}deg) translateZ(${radius}px)`,
                }}
              >
                <TechTile label={item.label!} slug={item.slug} icon={item.icon ?? `/icons/${item.slug}.png`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
