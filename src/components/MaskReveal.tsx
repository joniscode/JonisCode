'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/*
 * La transición única del sitio: una palabra recortada deja ver la red neuronal;
 * al hacer scroll el zoom entra por una letra, la red se activa y aparece el contenido.
 */

const MAX_ZOOM = 44

type NetNode = { x: number; y: number; layer: number; phase: number }
type NetEdge = { from: number; to: number }
type Pulse = { edge: number; t: number; speed: number }
type Network = { nodes: NetNode[]; edges: NetEdge[]; out: number[][]; layers: number }
type TextLine = { text: string; x: number; baseline: number }
type MaskLayout = { font: string; lines: TextLine[]; originX: number; originY: number }

type Props = {
  id: string
  lines: string[]
  /** Letra por la que entra el zoom: línea e índice dentro de esa línea. */
  zoomLine?: number
  zoomChar?: number
  heading?: 'h1' | 'h2'
  /** Alto total en vh: cuánto scroll dura la transición. */
  length?: number
  seed?: number
  before?: ReactNode
  after?: ReactNode
  scrollHint?: string
  /** Contenido que aparece cuando el zoom termina. */
  children: ReactNode
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

// Aleatorio con semilla: la red queda igual en cada carga y en cada resize.
function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildNetwork(width: number, height: number, seed: number): Network {
  const random = seeded(seed)
  const layers = width < 640 ? 5 : width < 1024 ? 6 : 8
  const counts = width < 640 ? [3, 5, 4, 5, 3] : [4, 6, 5, 7, 5, 6, 4, 5]
  const nodes: NetNode[] = []
  const byLayer: number[][] = []

  for (let layer = 0; layer < layers; layer += 1) {
    const count = counts[(layer + seed) % counts.length]
    const indexes: number[] = []

    for (let i = 0; i < count; i += 1) {
      indexes.push(nodes.length)
      nodes.push({
        x: (width * (layer + 0.5)) / layers + (random() - 0.5) * width * 0.03,
        y: height * (0.1 + (0.8 * (i + 0.5)) / count) + (random() - 0.5) * height * 0.05,
        layer,
        phase: random() * Math.PI * 2,
      })
    }

    byLayer.push(indexes)
  }

  const edges: NetEdge[] = []
  const out: number[][] = nodes.map(() => [])

  for (let layer = 0; layer < layers - 1; layer += 1) {
    for (const from of byLayer[layer]) {
      for (const to of byLayer[layer + 1]) {
        if (random() < 0.22) continue
        out[from].push(edges.length)
        edges.push({ from, to })
      }
    }
  }

  return { nodes, edges, out, layers }
}

/*
 * Punto más "profundo" de una letra (el más alejado de sus bordes), relativo a su
 * esquina izquierda y a la línea base, en unidades de em. Se erosiona la silueta de
 * la letra hasta que queda un solo grupo de píxeles: ahí entra el zoom.
 */
function deepestPoint(char: string, weight: string, family: string) {
  const size = 96
  const pad = 6
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return { x: 0.35, y: -0.35 }

  ctx.font = `${weight} ${size}px ${family}`
  const width = Math.ceil(ctx.measureText(char).width) + pad * 2
  const height = Math.ceil(size * 1.5)
  const baseline = Math.round(size * 1.15)
  canvas.width = width
  canvas.height = height

  ctx.font = `${weight} ${size}px ${family}`
  ctx.fillStyle = '#000'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(char, pad, baseline)

  const pixels = ctx.getImageData(0, 0, width, height).data
  let current = new Uint8Array(width * height)
  let filled = 0
  for (let i = 0; i < current.length; i += 1) {
    if (pixels[i * 4 + 3] > 128) {
      current[i] = 1
      filled += 1
    }
  }
  if (!filled) return { x: 0.35, y: -0.35 }

  let last = current
  for (let pass = 0; pass < size; pass += 1) {
    const next = new Uint8Array(width * height)
    let remaining = 0
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const i = y * width + x
        if (current[i] && current[i - 1] && current[i + 1] && current[i - width] && current[i + width]) {
          next[i] = 1
          remaining += 1
        }
      }
    }
    if (!remaining) break
    last = next
    current = next
  }

  let sumX = 0
  let sumY = 0
  let count = 0
  for (let i = 0; i < last.length; i += 1) {
    if (!last[i]) continue
    sumX += i % width
    sumY += Math.floor(i / width)
    count += 1
  }

  // De los píxeles que sobrevivieron, el más cercano a su centro.
  const centerX = sumX / count
  const centerY = sumY / count
  let best = 0
  let bestDistance = Infinity
  for (let i = 0; i < last.length; i += 1) {
    if (!last[i]) continue
    const distance = (i % width - centerX) ** 2 + (Math.floor(i / width) - centerY) ** 2
    if (distance < bestDistance) {
      bestDistance = distance
      best = i
    }
  }

  return { x: (best % width - pad) / size, y: (Math.floor(best / width) - baseline) / size }
}

export default function MaskReveal({
  id,
  lines,
  zoomLine = 0,
  zoomChar,
  heading = 'h2',
  length = 240,
  seed = 7,
  before,
  after,
  scrollHint,
  children,
}: Props) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const words = lines.map((line) => line.toUpperCase())
  const wordsKey = words.join('\n')
  const longest = Math.max(...words.map((word) => word.length))
  // El tamaño se ajusta a la palabra más larga para que siempre quepa en el ancho.
  const fontSize = `min(${(88 / (Math.max(longest, 3) * 0.78)).toFixed(2)}vw, ${words.length > 1 ? 21 : 30}svh)`

  const sectionRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const networkRef = useRef<HTMLCanvasElement | null>(null)
  const maskRef = useRef<HTMLCanvasElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const introRef = useRef<HTMLDivElement | null>(null)
  const scrimRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const networkCanvas = networkRef.current
    const maskCanvas = maskRef.current
    const title = titleRef.current
    const networkCtx = networkCanvas?.getContext('2d')
    const maskCtx = maskCanvas?.getContext('2d')
    if (!section || !stage || !networkCanvas || !maskCanvas || !title || !networkCtx || !maskCtx) return

    const texts = wordsKey.split('\n')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduced = motionQuery.matches
    setReducedMotion(reduced)

    let width = 0
    let height = 0
    let dpr = 1
    let progress = 0
    let network: Network = buildNetwork(1, 1, seed)
    let pulses: Pulse[] = []
    let layout: MaskLayout | null = null
    let frame = 0
    let scrollFrame = 0
    let lastTime = 0
    let visible = false
    let disposed = false

    // Los colores salen de las variables CSS de globals.css.
    const rootStyle = window.getComputedStyle(document.documentElement)
    const cssVar = (name: string) => rootStyle.getPropertyValue(name).trim()
    const colors = {
      bg: `rgb(${cssVar('--bg')})`,
      bgSoft: `rgb(${cssVar('--bg')} / 0.7)`,
      from: cssVar('--net-from'),
      via: cssVar('--net-via'),
      to: cssVar('--net-to'),
      line: cssVar('--net-line'),
      node: cssVar('--net-node'),
    }

    const measureMask = () => {
      const style = window.getComputedStyle(title)
      const size = parseFloat(style.fontSize)
      const font = `${style.fontWeight} ${size}px ${style.fontFamily}`
      const stageRect = stage.getBoundingClientRect()

      maskCtx.setTransform(1, 0, 0, 1, 0, 0)
      maskCtx.font = font

      const metrics = maskCtx.measureText('H')
      const ascent = metrics.fontBoundingBoxAscent || size * 0.8
      const descent = metrics.fontBoundingBoxDescent || size * 0.2

      const measured: TextLine[] = Array.from(title.querySelectorAll('span')).map((span, index) => {
        const rect = span.getBoundingClientRect()
        return {
          text: texts[index] ?? '',
          x: rect.left - stageRect.left + rect.width / 2,
          baseline: rect.top - stageRect.top + (rect.height - (ascent + descent)) / 2 + ascent,
        }
      })

      const target = measured[Math.min(zoomLine, measured.length - 1)]
      if (!target) return

      const charIndex = Math.min(zoomChar ?? Math.floor(target.text.length / 2), target.text.length - 1)
      const point = deepestPoint(target.text[charIndex], style.fontWeight, style.fontFamily)
      const lineLeft = target.x - maskCtx.measureText(target.text).width / 2
      const charLeft = lineLeft + maskCtx.measureText(target.text.slice(0, charIndex)).width

      layout = {
        font,
        lines: measured,
        originX: charLeft + point.x * size,
        originY: target.baseline + point.y * size,
      }
    }

    const drawMask = () => {
      maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      maskCtx.clearRect(0, 0, width, height)
      if (!layout) return

      const open = clamp(progress / 0.5)
      const alpha = 1 - clamp((open - 0.45) / 0.55)
      if (alpha <= 0.001) return

      const zoom = Math.pow(MAX_ZOOM, open)

      maskCtx.globalAlpha = alpha
      maskCtx.fillStyle = colors.bg
      maskCtx.fillRect(0, 0, width, height)

      maskCtx.globalAlpha = 1
      maskCtx.globalCompositeOperation = 'destination-out'
      maskCtx.translate(layout.originX, layout.originY)
      maskCtx.scale(zoom, zoom)
      maskCtx.translate(-layout.originX, -layout.originY)
      maskCtx.font = layout.font
      maskCtx.textAlign = 'center'
      maskCtx.textBaseline = 'alphabetic'
      for (const line of layout.lines) maskCtx.fillText(line.text, line.x, line.baseline)
      maskCtx.globalCompositeOperation = 'source-over'
    }

    const drawNetwork = (time: number) => {
      const ctx = networkCtx
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, colors.from)
      gradient.addColorStop(0.62, colors.via)
      gradient.addColorStop(1, colors.to)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      const seconds = time / 1000
      const points = network.nodes.map((node) => ({
        x: node.x,
        y: node.y + (reduced ? 0 : Math.sin(seconds * 0.5 + node.phase) * 4),
      }))

      ctx.lineWidth = 1
      ctx.strokeStyle = colors.line
      ctx.beginPath()
      for (const edge of network.edges) {
        ctx.moveTo(points[edge.from].x, points[edge.from].y)
        ctx.lineTo(points[edge.to].x, points[edge.to].y)
      }
      ctx.stroke()

      ctx.fillStyle = colors.node
      for (const pulse of pulses) {
        const edge = network.edges[pulse.edge]
        if (!edge) continue
        const a = points[edge.from]
        const b = points[edge.to]
        ctx.beginPath()
        ctx.arc(a.x + (b.x - a.x) * pulse.t, a.y + (b.y - a.y) * pulse.t, 2.4, 0, Math.PI * 2)
        ctx.fill()
      }

      // El scroll "propaga" la activación de la red capa por capa.
      const activeLayers = 1 + progress * network.layers * 1.15
      const radius = width < 640 ? 4.5 : 6
      ctx.lineWidth = 1.5
      ctx.strokeStyle = colors.node
      network.nodes.forEach((node, index) => {
        ctx.beginPath()
        ctx.arc(points[index].x, points[index].y, radius, 0, Math.PI * 2)
        ctx.fillStyle = node.layer < activeLayers ? colors.node : colors.bgSoft
        ctx.fill()
        ctx.stroke()
      })
    }

    const applyProgress = () => {
      const intro = introRef.current
      const scrim = scrimRef.current
      const content = contentRef.current

      if (intro) {
        const opacity = 1 - clamp(progress / 0.12)
        intro.style.opacity = String(opacity)
        intro.style.pointerEvents = opacity < 0.5 ? 'none' : ''
      }
      if (scrim) scrim.style.opacity = String(clamp((progress - 0.22) / 0.26) * 0.84)
      if (content && !reduced) {
        const opacity = clamp((progress - 0.5) / 0.16)
        content.style.opacity = String(opacity)
        content.style.transform = `translateY(${(1 - opacity) * 28}px)`
        content.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none'
      }

      drawMask()
    }

    const readProgress = () => {
      scrollFrame = 0
      if (reduced) {
        progress = 0
      } else {
        const rect = section.getBoundingClientRect()
        const distance = rect.height - window.innerHeight
        progress = distance > 0 ? clamp(-rect.top / distance) : 0
      }
      applyProgress()
      if (!frame) drawNetwork(performance.now())
    }

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(readProgress)
    }

    const resize = () => {
      width = stage.clientWidth
      height = stage.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      for (const canvas of [networkCanvas, maskCanvas]) {
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
      }

      network = buildNetwork(width, height, seed)
      const random = seeded(seed + 4)
      pulses = Array.from({ length: width < 640 ? 8 : 16 }, () => ({
        edge: Math.floor(random() * network.edges.length),
        t: random(),
        speed: 0.18 + random() * 0.22,
      }))

      measureMask()
      readProgress()
      drawNetwork(performance.now())
    }

    const tick = (time: number) => {
      frame = 0
      if (disposed) return

      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0
      lastTime = time

      for (const pulse of pulses) {
        pulse.t += pulse.speed * delta
        if (pulse.t < 1) continue

        // Al llegar a un nodo, la señal sigue por una conexión de salida (o vuelve a empezar).
        const next = network.out[network.edges[pulse.edge]?.to ?? -1]
        pulse.edge = next?.length
          ? next[Math.floor(Math.random() * next.length)]
          : Math.floor(Math.random() * network.edges.length)
        pulse.t = 0
      }

      drawNetwork(time)
      if (visible && !reduced) frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!frame && visible && !reduced) {
        lastTime = 0
        frame = requestAnimationFrame(tick)
      }
    }

    // La red solo se anima mientras su pantalla está visible.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      start()
    })
    observer.observe(stage)

    const onMotionChange = () => {
      reduced = motionQuery.matches
      setReducedMotion(reduced)
      // El alto de la sección cambia con el modo: se vuelve a medir en el siguiente frame.
      requestAnimationFrame(() => {
        resize()
        start()
      })
    }

    resize()
    document.fonts.ready.then(() => {
      if (!disposed) resize()
    })

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    motionQuery.addEventListener('change', onMotionChange)

    return () => {
      disposed = true
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
      if (scrollFrame) cancelAnimationFrame(scrollFrame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [wordsKey, zoomLine, zoomChar, seed])

  const Heading = heading

  return (
    <>
      <section
        id={id}
        ref={sectionRef}
        data-mask-stage
        className="relative"
        style={{ height: reducedMotion ? '100svh' : `${length}vh` }}
      >
        <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden">
          <canvas ref={networkRef} aria-hidden className="absolute inset-0 h-full w-full" />
          <div ref={scrimRef} aria-hidden className="absolute inset-0 bg-bg opacity-0" />
          <canvas ref={maskRef} aria-hidden className="absolute inset-0 h-full w-full" />

          <div
            ref={introRef}
            className="absolute inset-0 flex flex-col items-center justify-center px-5 pb-10 pt-20 text-center"
          >
            {before}

            {/* La palabra se pinta en el canvas como recorte; este título reserva el espacio y la deja accesible. */}
            <Heading
              ref={titleRef}
              className="my-5 select-none font-black uppercase leading-[0.9] text-transparent sm:my-7"
              style={{ fontSize }}
            >
              {lines.map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </Heading>

            {after}

            {scrollHint && !reducedMotion ? (
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
                {scrollHint} ↓
              </p>
            ) : null}
          </div>

          {!reducedMotion ? (
            <div ref={contentRef} className="pointer-events-none absolute inset-0 flex items-center opacity-0">
              {children}
            </div>
          ) : null}
        </div>
      </section>

      {reducedMotion ? <div className="border-t border-ink/10 py-24">{children}</div> : null}
    </>
  )
}
