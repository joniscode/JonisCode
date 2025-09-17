'use client'
import React from 'react'

type Point = { x: number; y: number }
type Props = {
  origin?: Point            // punto de fuga (px en viewport); por defecto centro
  durationMs?: number       // duración total (ms)
  onComplete: () => void    // se llama al terminar la animación
}

type Star = { x: number; y: number; z: number; px: number; py: number }

export default function StarWarpOverlay({
  origin,
  durationMs = 1100,
  onComplete,
}: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const rafRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d', { alpha: false })!
    let dpr = Math.max(1, window.devicePixelRatio || 1)
    let vw = window.innerWidth, vh = window.innerHeight
    let W = Math.floor(vw * dpr), H = Math.floor(vh * dpr)
    canvas.width = W; canvas.height = H
    canvas.style.width = vw + 'px'; canvas.style.height = vh + 'px'

    const cx = (origin?.x ?? vw / 2) * dpr
    const cy = (origin?.y ?? vh / 2) * dpr

    const DEPTH = 900 // mayor = más “lejos”
    const N = Math.min(700, Math.floor((vw * vh) / 1800)) // densidad según pantalla
    const stars: Star[] = []
    const rand = (a: number, b: number) => a + Math.random() * (b - a)

    function spawnStar(s?: Star) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * Math.max(W, H) * 0.7
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const z = rand(DEPTH * 0.4, DEPTH)
      return { x, y, z, px: 0, py: 0 }
    }
    for (let i = 0; i < N; i++) stars.push(spawnStar())

    const t0 = performance.now()
    const EASE = (t: number) => t * t * (2 - t) // easeOutQuad
    const MAX_SPEED = 42 // mayor = más velocidad de “salto”
    let flash = 0

    function frame(now: number) {
      const t = Math.min(1, (now - t0) / durationMs)
      const speed = MAX_SPEED * EASE(t)

      // fondo
      ctx.fillStyle = '#000' // espacio
      ctx.fillRect(0, 0, W, H)

      ctx.save()
      ctx.translate(cx, cy)

      for (let i = 0; i < N; i++) {
        const s = stars[i]
        s.z -= speed
        if (s.z <= 1) Object.assign(s, spawnStar(s))

        // proyección (x/z, y/z) con f=~ DEPTH/2
        const f = (DEPTH * 0.6) / s.z
        const sx = s.x * f
        const sy = s.y * f

        // línea desde pos previa (para rastro)
        const x1 = s.px || sx, y1 = s.py || sy
        s.px = sx; s.py = sy

        const alpha = Math.max(0, 1 - s.z / DEPTH)
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(sx, sy)
        ctx.strokeStyle = `rgba(255,255,255,${0.15 + alpha * 0.85})`
        ctx.lineWidth = Math.max(1, 2 * (1 - s.z / DEPTH))
        ctx.stroke()
      }

      ctx.restore()

      // flash final (breve fundido a blanco)
      if (t > 0.85) {
        flash = Math.min(1, (t - 0.85) / 0.15)
        ctx.fillStyle = `rgba(255,255,255,${flash})`
        ctx.fillRect(0, 0, W, H)
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame)
      } else {
        onComplete()
      }
    }

    rafRef.current = requestAnimationFrame(frame)

    const onResize = () => {
      vw = window.innerWidth; vh = window.innerHeight
      dpr = Math.max(1, window.devicePixelRatio || 1)
      W = Math.floor(vw * dpr); H = Math.floor(vh * dpr)
      canvas.width = W; canvas.height = H
      canvas.style.width = vw + 'px'; canvas.style.height = vh + 'px'
    }
    window.addEventListener('resize', onResize)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [origin, durationMs, onComplete])

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
