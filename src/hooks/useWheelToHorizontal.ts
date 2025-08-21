'use client'
import { RefObject, useEffect } from 'react'

export default function useWheelToHorizontal(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      // solo actúa si hay más contenido que el ancho visible
      if (el.scrollWidth <= el.clientWidth) return

      // convierte scroll vertical en horizontal
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      if (delta !== 0) {
        e.preventDefault()
        el.scrollLeft += delta
      }
    }

    // importante: passive:false para poder preventDefault()
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [ref])
}
