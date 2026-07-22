'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import TechTile from './TechTile'
import { useLanguage } from './LanguageProvider'

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
    const minArc = itemCount >= 13 ? 92 : 100
    const radius = Math.min(285, Math.max(215, Math.round((itemCount * minArc) / (2 * Math.PI))))

    return {
      radius,
      sceneHeight: Math.min(330, Math.max(280, Math.round(radius * 1.3))),
      tileSize,
    }
  }

  if (viewportWidth < 1024) {
    const tileSize = itemCount >= 13 ? 'cozy' : 'regular'
    const minArc = itemCount >= 13 ? 114 : 124
    const radius = Math.min(365, Math.max(260, Math.round((itemCount * minArc) / (2 * Math.PI))))

    return {
      radius,
      sceneHeight: Math.min(360, Math.max(290, Math.round(radius * 1.12))),
      tileSize,
    }
  }

  const tileSize = itemCount >= 13 ? 'cozy' : 'regular'
  const minArc = itemCount >= 13 ? 134 : 146
  const radius = Math.min(470, Math.max(320, Math.round((itemCount * minArc) / (2 * Math.PI))))

  return {
    radius,
    sceneHeight: Math.min(400, Math.max(330, Math.round(radius * 0.96))),
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

const COPY = {
  en: {
    title: 'Tools',
    description:
      'Technologies and tools I use to build scalable, maintainable and high-performance web applications.',
  },
  es: {
    title: 'Herramientas',
    description:
      'Tecnologías y herramientas que uso para crear aplicaciones web escalables, mantenibles y de alto rendimiento.',
  },
} as const

export default function TechRing({ items, tiltDeg = 12, autoSpeed = 0.1 }: Props) {
  const { language } = useLanguage()
  const t = COPY[language]
  const sceneRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const resizeFrameRef = useRef<number | null>(null)
  const dragRef = useRef<{ dragging: boolean; lastX: number } | null>(null)
  const velocityRef = useRef(0)
  const angleRef = useRef(0)
  const [layout, setLayout] = useState<Layout>({ radius: 260, sceneHeight: 500, tileSize: 'regular' })
  const [isVisible, setIsVisible] = useState(true)

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
  const lift = Math.round(Math.min(24, radius * 0.06))

  useEffect(() => {
    const updateLayout = () => {
      setLayout(getRingLayout(window.innerWidth, data.length))
    }

    const scheduleLayout = () => {
      if (resizeFrameRef.current !== null) return

      resizeFrameRef.current = requestAnimationFrame(() => {
        resizeFrameRef.current = null
        updateLayout()
      })
    }

    updateLayout()
    window.addEventListener('resize', scheduleLayout)
    return () => {
      if (resizeFrameRef.current !== null) cancelAnimationFrame(resizeFrameRef.current)
      window.removeEventListener('resize', scheduleLayout)
    }
  }, [data.length])

  useEffect(() => {
    setRingTransform(ringRef.current, lift, tiltDeg, angleRef.current)
  }, [lift, tiltDeg])

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )

    observer.observe(scene)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let lastFrameTime = 0

    if (motionQuery.matches || !isVisible) {
      setRingTransform(ringRef.current, lift, tiltDeg, angleRef.current)
      return
    }

    const tick = (now: number) => {
      if (document.visibilityState !== 'visible') {
        frameRef.current = requestAnimationFrame(tick)
        return
      }

      const elapsed = lastFrameTime ? Math.min((now - lastFrameTime) / 16.67, 2) : 1
      lastFrameTime = now

      if (!dragRef.current?.dragging && !motionQuery.matches) {
        velocityRef.current *= 0.985
        angleRef.current += autoSpeed * elapsed + velocityRef.current
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
  }, [autoSpeed, isVisible, lift, tiltDeg])

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
      angleRef.current += delta * 0.35
      velocityRef.current = delta * 0.08
      setRingTransform(ringRef.current, lift, tiltDeg, angleRef.current)
    }

    const onUp = (event: PointerEvent) => {
      dragRef.current = { dragging: false, lastX: event.clientX }
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId)
      }
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
  }, [lift, tiltDeg])

  return (
    <div className="relative z-0 mx-auto w-full max-w-6xl pt-6 sm:pt-8 lg:pt-10">
      <div className="mb-6 text-center sm:mb-8 lg:mb-9">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          <span className="text-gradient-gpt">{t.title}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-sm opacity-80 sm:text-base">
          {t.description}
        </p>
      </div>

      <div className="relative px-2 pb-0 pt-3 sm:px-4 sm:pt-4">
        <div
          ref={sceneRef}
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
