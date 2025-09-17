'use client'
import React from 'react'
import { motion } from 'framer-motion'

export default function ArrivalFromStar({ children }: { children: React.ReactNode }) {
  const [pt, setPt] = React.useState<{x:number,y:number} | null>(null)

  React.useEffect(() => {
    // lee el punto guardado en el cover; si no hay, usa centro
    try {
      const raw = sessionStorage.getItem('arrivalPoint')
      if (raw) setPt(JSON.parse(raw))
    } catch {}
    // opcional: limpiar para no repetir
    // sessionStorage.removeItem('arrivalPoint')
  }, [])

  const x = pt?.x ?? typeof window !== 'undefined' ? window.innerWidth / 2 : 0
  const y = pt?.y ?? typeof window !== 'undefined' ? window.innerHeight / 2 : 0

  const clipFrom = `circle(0px at ${x}px ${y}px)`
  const clipTo = `circle(150vmax at ${x}px ${y}px)`

  return (
    <div className="relative">
      {/* Estrella inicial (destello) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.2, x: x - 2, y: y - 2 }}
        animate={{ opacity: [0, 1, 0.9, 0], scale: [0.2, 1.8, 2.4, 2.8] }}
        transition={{ duration: 0.9, times: [0, 0.3, 0.6, 1], ease: 'easeOut' }}
        className="pointer-events-none fixed z-40 h-4 w-4 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.1) 60%, rgba(255,255,255,0) 70%)'
        }}
      />

      {/* El contenido se revela desde ese punto con clip-path */}
      <motion.div
        initial={{ clipPath: clipFrom }}
        animate={{ clipPath: clipTo }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  )
}