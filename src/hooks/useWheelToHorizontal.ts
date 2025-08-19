// src/hooks/useWheelToHorizontal.ts
'use client'
import { useEffect } from 'react'

export default function useWheelToHorizontal(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0
      const atEnd   = el.scrollLeft + el.clientWidth >= el.scrollWidth && e.deltaY > 0
      if (atStart || atEnd) return // deja que el scroll vertical avance/retroceda
      // consume el vertical y muévete horizontal
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [ref])
}