'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import TechTile from './TechTile'

type Item = string | { slug: string; label?: string; icon?: string }

type Props = {
  items: Item[]
  tiltDeg?: number
  autoSpeed?: number
}

type Layout = {
  radius: number
  sceneHeight: number
  tileSize: 'compact' | 'cozy' | 'regular'
}

function getRingLayout(viewportWidth: number, itemCount: number): Layout {
  if (viewportWidth < 640) {
    const tileSize = itemCount >= 13 ? 'compact' : 'cozy'
    const minArc = itemCount >= 13 ? 76 : 84
    const radius = Math.min(235, Math.max(185, Math.round((itemCount * minArc) / (2 * Math.PI))))

    return {
      radius,
      sceneHeight: Math.min(430, Math.max(360, Math.round(radius * 1.95))),
      tileSize,
    }
  }

  if (viewportWidth < 1024) {
    const tileSize = itemCount >= 13 ? 'cozy' : 'regular'
    const minArc = itemCount >= 13 ? 94 : 104
    const radius = Math.min(300, Math.max(220, Math.round((itemCount * minArc) / (2 * Math.PI))))

    return {
      radius,
      sceneHeight: Math.min(500, Math.max(420, Math.round(radius * 1.8))),
      tileSize,
    }
  }

  const tileSize = itemCount >= 13 ? 'cozy' : 'regular'
  const minArc = itemCount >= 13 ? 110 : 122
  const radius = Math.min(380, Math.max(270, Math.round((itemCount * minArc) / (2 * Math.PI))))

  return {
    radius,
    sceneHeight: Math.min(620, Math.max(500, Math.round(radius * 1.68))),
    tileSize,
  }
}

function setRingTransform(
  element: HTMLDivElement | null,
  lift: number,
  tiltDeg: number,
  angle: number
) {
  if (!element) return

  element.style.transform = `translateY(-${lift}px) rotateX(${tiltDeg}deg) rotateY(${angle}deg)`
}

export default function TechRing({ items, tiltDeg = 12, autoSpeed = 0.18 }: Props) {
  const ringRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const dragRef = useRef<{ dragging: boolean; lastX: number } | null>(null)
  const velocityRef = useRef(0)
  const angleRef = useRef(0)
  const [layout, setLayout] = useState<Layout>({ radius: 260, sceneHeight: 500, tileSize: 'regular' })

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
  const { radius, sceneHeight, tileSize } = layout
  const lift = Math.round(Math.min(72, radius * 0.2))

  useEffect(() => {
    const updateLayout = () => {
      setLayout(getRingLayout(window.innerWidth, data.length))
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [data.length])

  useEffect(() => {
    setRingTransform(ringRef.current, lift, tiltDeg, angleRef.current)
  }, [lift, tiltDeg])

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

      setRingTransform(ringRef.current, lift, tiltDeg, angleRef.current)
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

      <div className="relative px-4 py-8 sm:px-6 sm:py-10">
        <div
          className="relative mx-auto [perspective:1600px]"
          style={{ height: `${sceneHeight}px` }}
        >
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
                <TechTile
                  label={item.label!}
                  slug={item.slug}
                  icon={item.icon ?? `/icons/${item.slug}.png`}
                  size={tileSize}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
