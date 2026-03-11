// src/components/ConstellationBackground.tsx
'use client'
import { useEffect, useRef } from 'react'

type Dot = { x: number; y: number; vx: number; vy: number; r: number }

export default function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dotsRef = useRef<Dot[]>([])
  const rafRef = useRef<number | null>(null)

  // cursor con fuerza que decae
  const mouseRef = useRef({
    x: 0, y: 0, vx: 0, vy: 0, strength: 0, lastMove: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

    // === DENSIDAD AUTOMÁTICA (↓ en móvil para ahorrar) ===
    const isMobile = matchMedia('(max-width: 640px)').matches || (navigator.maxTouchPoints ?? 0) > 0
    const baseDensity = Math.floor((w * h) / 25000)                       // base
    const densityFactor = reducedMotion ? 0.4 : isMobile ? 0.55 : 0.82
    const densityMin = reducedMotion ? 26 : 42
    const densityMax = reducedMotion ? 58 : 110
    const density = Math.min(densityMax, Math.max(densityMin, Math.floor(baseDensity * densityFactor))) // limites

    let maxDist = Math.min(w, h) * 0.12      // distancia para líneas entre puntos
    let influence = Math.min(w, h) * (reducedMotion ? 0.18 : 0.28)    // radio de influencia del cursor
    const sepRadius = 26                      // separación entre puntos
    const sepForce = 0.015
    const wanderJitter = reducedMotion ? 0.008 : 0.02                 // “ruido” propio
    const minSpeed = reducedMotion ? 0.05 : 0.10
    const maxSpeed = reducedMotion ? 0.28 : 0.60

    // === VIENTO CON DIRECCIÓN CAMBIANTE ===
    const wind = {
      angle: Math.random() * Math.PI * 2,
      speedBase: 0.018,
      speedAmp: 0.012,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.004,            // qué tan rápido cambia la velocidad
      turnRate: 0.002,              // qué tan rápido gira el viento
    }

    // puntos
    dotsRef.current = Array.from({ length: density }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6,
    }))

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      maxDist = Math.min(w, h) * 0.12
      influence = Math.min(w, h) * (reducedMotion ? 0.18 : 0.28)
      // Nota: mantenemos el mismo número de puntos en tiempo de vida del componente
      // (si quieres re-amostrar densidad al redimensionar, podemos hacerlo también).
    }

    const onMove = (e: PointerEvent) => {
      const m = mouseRef.current
      const px = m.x, py = m.y
      m.x = e.clientX; m.y = e.clientY
      m.vx = m.x - px; m.vy = m.y - py
      m.lastMove = performance.now()
      m.strength = Math.min(1, m.strength + 0.35)
    }
    const killMouse = () => {
      const m = mouseRef.current
      m.strength = 0; m.vx = 0; m.vy = 0
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', killMouse)
    window.addEventListener('blur', killMouse)
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') killMouse()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    const tick = () => {
      ctx.clearRect(0, 0, w, h)

      const isDark = document.documentElement.classList.contains('dark')
      const dotColor = isDark ? 'rgba(173,186,207,0.65)' : 'rgba(31,41,55,0.55)'
      const lineBase = isDark ? 0.18 : 0.12
      const lineMax  = isDark ? 0.40 : 0.28

      const dots = dotsRef.current
      const m = mouseRef.current
      const now = performance.now()

      // decaimiento del cursor si no se mueve
      if (now - m.lastMove > 120) {
        m.strength *= 0.92
        if (m.strength < 0.01) m.strength = 0
      }

      // === actualizar viento (dirección y magnitud) ===
      wind.phase += wind.phaseSpeed
      wind.angle += wind.turnRate
      const windSpeed = wind.speedBase + Math.sin(wind.phase) * wind.speedAmp
      const wx = Math.cos(wind.angle) * windSpeed
      const wy = Math.sin(wind.angle) * windSpeed

      // 1) separación anti-clúster
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist > 0 && dist < sepRadius) {
            const f = sepForce * (1 - dist / sepRadius)
            const fx = (dx / dist) * f, fy = (dy / dist) * f
            a.vx += fx; a.vy += fy
            b.vx -= fx; b.vy -= fy
          }
        }
      }

      // 2) movimiento: jitter + viento + cursor + límites
      for (const d of dots) {
        // ruido local
        d.vx += (Math.random() - 0.5) * wanderJitter
        d.vy += (Math.random() - 0.5) * wanderJitter

        // viento global (suave, direccional, cambiante)
        d.vx += wx * 0.35
        d.vy += wy * 0.35

        // cursor con falloff cuadrático (sin imán gigante)
        if (m.strength > 0) {
          const dx = m.x - d.x, dy = m.y - d.y
          const dist = Math.hypot(dx, dy)
          if (dist < influence) {
            const fall = 1 - dist / influence
            const pull = 0.008 * m.strength * (fall * fall)
            d.vx += dx * pull; d.vy += dy * pull
          }
        }

        // clamp de velocidad
        const speed = Math.hypot(d.vx, d.vy)
        if (speed > maxSpeed) {
          d.vx = (d.vx / speed) * maxSpeed
          d.vy = (d.vy / speed) * maxSpeed
        } else if (speed < minSpeed) {
          const boost = (minSpeed - speed) * 0.5
          const angle = Math.random() * Math.PI * 2
          d.vx += Math.cos(angle) * boost
          d.vy += Math.sin(angle) * boost
        }

        // integrar + wrap en bordes
        d.x += d.vx; d.y += d.vy
        if (d.x < 0) d.x += w; if (d.x > w) d.x -= w
        if (d.y < 0) d.y += h; if (d.y > h) d.y -= h
      }

      // 3) conexiones entre puntos
      ctx.beginPath()
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.hypot(dx, dy)
          if (dist < maxDist) {
            const alpha = lineBase + (1 - dist / maxDist) * lineMax
            ctx.strokeStyle = `rgba(99,126,172,${alpha.toFixed(2)})`
            ctx.lineWidth = 1
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
          }
        }
      }
      ctx.stroke()

      // 4) líneas + halo con el cursor si hay fuerza
      if (m.strength > 0) {
        ctx.beginPath()
        for (const d of dots) {
          const dx = m.x - d.x, dy = m.y - d.y
          const dist = Math.hypot(dx, dy)
          if (dist < influence * 0.6) {
            const alpha = 0.10 + (1 - dist / (influence * 0.6)) * 0.26
            ctx.strokeStyle = `rgba(140,170,220,${alpha.toFixed(2)})`
            ctx.lineWidth = 1
            ctx.moveTo(m.x, m.y)
            ctx.lineTo(d.x, d.y)
          }
        }
        ctx.stroke()

        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 80)
        g.addColorStop(0, isDark ? 'rgba(160,190,255,0.12)' : 'rgba(40,60,100,0.10)')
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(m.x, m.y, 80, 0, Math.PI * 2)
        ctx.fill()
      }

      // 5) puntos
      for (const d of dots) {
        ctx.beginPath()
        ctx.fillStyle = dotColor
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', killMouse)
      window.removeEventListener('blur', killMouse)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden
    />
  )
}
