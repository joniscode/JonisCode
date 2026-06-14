// src/components/ConstellationBackground.tsx
'use client'
import { useEffect, useRef } from 'react'

type Dot = { x: number; y: number; vx: number; vy: number; r: number }

type Props = {
  interactive?: boolean
  quality?: 'full' | 'lite'
}

type QualityConfig = {
  densityDivisor: number
  mobileDensityFactor: number
  minDots: number
  maxDots: number
  maxDistFactor: number
  influenceFactor: number
  wanderJitter: number
  minSpeed: number
  maxSpeed: number
  windScale: number
  haloRadius: number
  haloStrength: number
}

const QUALITY_CONFIG: Record<NonNullable<Props['quality']>, QualityConfig> = {
  full: {
    densityDivisor: 42000,
    mobileDensityFactor: 0.5,
    minDots: 38,
    maxDots: 88,
    maxDistFactor: 0.115,
    influenceFactor: 0.24,
    wanderJitter: 0.012,
    minSpeed: 0.08,
    maxSpeed: 0.38,
    windScale: 0.28,
    haloRadius: 72,
    haloStrength: 1,
  },
  lite: {
    densityDivisor: 60000,
    mobileDensityFactor: 0.42,
    minDots: 24,
    maxDots: 54,
    maxDistFactor: 0.1,
    influenceFactor: 0.18,
    wanderJitter: 0.008,
    minSpeed: 0.06,
    maxSpeed: 0.28,
    windScale: 0.2,
    haloRadius: 56,
    haloStrength: 0.55,
  },
}

export default function ConstellationBackground({
  interactive = true,
  quality = 'full',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dotsRef = useRef<Dot[]>([])
  const rafRef = useRef<number | null>(null)
  const mouseRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    strength: 0,
    lastMove: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const settings = QUALITY_CONFIG[quality]
    const root = document.documentElement
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = window.innerWidth
    let h = window.innerHeight
    let dpr = 1
    let maxDist = 0
    let influence = 0
    let isDark = root.classList.contains('dark')
    let isRunning = false
    let resizeFrame = 0
    let lastFrameTime = 0

    const isMobile = matchMedia('(max-width: 640px)').matches || (navigator.maxTouchPoints ?? 0) > 0
    const densityScale = reducedMotion ? 0.7 : 1
    const targetFrameMs = reducedMotion ? 1000 / 18 : quality === 'lite' ? 1000 / 28 : 1000 / 36
    const baseDensity = Math.floor((w * h) / settings.densityDivisor)
    const density = Math.min(
      settings.maxDots,
      Math.max(
        settings.minDots,
        Math.floor(baseDensity * (isMobile ? settings.mobileDensityFactor : 1) * densityScale)
      )
    )

    const sepRadius = quality === 'lite' ? 18 : 22
    const sepForce = 0.015
    const neighborOffsets = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [-1, 1],
    ] as const

    const wind = {
      angle: Math.random() * Math.PI * 2,
      speedBase: quality === 'lite' ? 0.012 : 0.016,
      speedAmp: quality === 'lite' ? 0.008 : 0.01,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.004,
      turnRate: 0.002,
    }

    const applyCanvasSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, quality === 'lite' ? 1.1 : 1.4)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      maxDist = Math.min(w, h) * settings.maxDistFactor
      influence = Math.min(w, h) * settings.influenceFactor * (reducedMotion ? 0.8 : 1)
    }

    dotsRef.current = Array.from({ length: density }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * (quality === 'lite' ? 1.2 : 1.5) + 0.5,
    }))
    applyCanvasSize()

    const onResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(applyCanvasSize)
    }

    const onMove = (e: PointerEvent) => {
      if (!interactive) return
      const m = mouseRef.current
      const px = m.x
      const py = m.y
      m.x = e.clientX
      m.y = e.clientY
      m.vx = m.x - px
      m.vy = m.y - py
      m.lastMove = performance.now()
      m.strength = Math.min(1, m.strength + 0.35)
    }

    const killMouse = () => {
      const m = mouseRef.current
      m.strength = 0
      m.vx = 0
      m.vy = 0
    }

    const themeObserver = new MutationObserver(() => {
      isDark = root.classList.contains('dark')
    })

    window.addEventListener('resize', onResize)
    if (interactive) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerleave', killMouse)
    }
    window.addEventListener('blur', killMouse)
    themeObserver.observe(root, { attributes: true, attributeFilter: ['class'] })

    const stop = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      isRunning = false
    }

    const start = () => {
      if (isRunning) return
      isRunning = true
      rafRef.current = requestAnimationFrame(tick)
    }

    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        killMouse()
        stop()
        return
      }

      start()
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    const tick = (now: number) => {
      if (document.visibilityState !== 'visible') {
        stop()
        return
      }

      if (now - lastFrameTime < targetFrameMs) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      lastFrameTime = now
      ctx.clearRect(0, 0, w, h)

      const dotColor = isDark ? 'rgba(173,186,207,0.65)' : 'rgba(31,41,55,0.55)'
      const lineBase = isDark ? 0.18 : 0.12
      const lineMax = isDark ? 0.38 : 0.24

      const dots = dotsRef.current
      const m = mouseRef.current

      if (now - m.lastMove > 120) {
        m.strength *= 0.92
        if (m.strength < 0.01) m.strength = 0
      }

      wind.phase += wind.phaseSpeed
      wind.angle += wind.turnRate
      const windSpeed = wind.speedBase + Math.sin(wind.phase) * wind.speedAmp
      const wx = Math.cos(wind.angle) * windSpeed
      const wy = Math.sin(wind.angle) * windSpeed

      for (const d of dots) {
        d.vx += (Math.random() - 0.5) * settings.wanderJitter
        d.vy += (Math.random() - 0.5) * settings.wanderJitter

        d.vx += wx * settings.windScale
        d.vy += wy * settings.windScale

        if (interactive && m.strength > 0) {
          const dx = m.x - d.x
          const dy = m.y - d.y
          const dist = Math.hypot(dx, dy)
          if (dist < influence) {
            const fall = 1 - dist / influence
            const pull = 0.006 * m.strength * (fall * fall)
            d.vx += dx * pull
            d.vy += dy * pull
          }
        }

        const speed = Math.hypot(d.vx, d.vy)
        if (speed > settings.maxSpeed) {
          d.vx = (d.vx / speed) * settings.maxSpeed
          d.vy = (d.vy / speed) * settings.maxSpeed
        } else if (speed < settings.minSpeed) {
          const boost = (settings.minSpeed - speed) * 0.45
          const angle = Math.random() * Math.PI * 2
          d.vx += Math.cos(angle) * boost
          d.vy += Math.sin(angle) * boost
        }

        d.x += d.vx
        d.y += d.vy
        if (d.x < 0) d.x += w
        if (d.x > w) d.x -= w
        if (d.y < 0) d.y += h
        if (d.y > h) d.y -= h
      }

      const cellSize = Math.max(maxDist, sepRadius)
      const cells = new Map<string, number[]>()
      dots.forEach((dot, index) => {
        const cellX = Math.floor(dot.x / cellSize)
        const cellY = Math.floor(dot.y / cellSize)
        const key = `${cellX}:${cellY}`
        const bucket = cells.get(key)

        if (bucket) bucket.push(index)
        else cells.set(key, [index])
      })

      ctx.beginPath()
      ctx.lineWidth = 1

      for (const [key, bucket] of cells) {
        const [cellX, cellY] = key.split(':').map(Number)

        for (const [offsetX, offsetY] of neighborOffsets) {
          const neighbor = cells.get(`${cellX + offsetX}:${cellY + offsetY}`)
          if (!neighbor) continue

          for (let i = 0; i < bucket.length; i++) {
            const startIndex = offsetX === 0 && offsetY === 0 ? i + 1 : 0
            const a = dots[bucket[i]]

            for (let j = startIndex; j < neighbor.length; j++) {
              const b = dots[neighbor[j]]
              const dx = a.x - b.x
              const dy = a.y - b.y
              const dist = Math.hypot(dx, dy)

              if (dist > 0 && dist < sepRadius) {
                const force = sepForce * (1 - dist / sepRadius)
                const fx = (dx / dist) * force
                const fy = (dy / dist) * force
                a.vx += fx
                a.vy += fy
                b.vx -= fx
                b.vy -= fy
              }

              if (dist < maxDist) {
                const alpha = lineBase + (1 - dist / maxDist) * lineMax
                ctx.strokeStyle = `rgba(99,126,172,${alpha.toFixed(2)})`
                ctx.moveTo(a.x, a.y)
                ctx.lineTo(b.x, b.y)
              }
            }
          }
        }
      }

      ctx.stroke()

      if (interactive && m.strength > 0) {
        ctx.beginPath()
        for (const d of dots) {
          const dx = m.x - d.x
          const dy = m.y - d.y
          const dist = Math.hypot(dx, dy)
          if (dist < influence * 0.6) {
            const alpha = 0.1 + (1 - dist / (influence * 0.6)) * 0.26
            ctx.strokeStyle = `rgba(140,170,220,${alpha.toFixed(2)})`
            ctx.lineWidth = 1
            ctx.moveTo(m.x, m.y)
            ctx.lineTo(d.x, d.y)
          }
        }
        ctx.stroke()

        const haloRadius = settings.haloRadius
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, haloRadius)
        g.addColorStop(
          0,
          isDark
            ? `rgba(160,190,255,${0.12 * settings.haloStrength})`
            : `rgba(40,60,100,${0.1 * settings.haloStrength})`
        )
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(m.x, m.y, haloRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const d of dots) {
        ctx.beginPath()
        ctx.fillStyle = dotColor
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    start()

    return () => {
      stop()
      themeObserver.disconnect()
      cancelAnimationFrame(resizeFrame)
      window.removeEventListener('resize', onResize)
      if (interactive) {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerleave', killMouse)
      }
      window.removeEventListener('blur', killMouse)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [interactive, quality])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10" aria-hidden />
}
