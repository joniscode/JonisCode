'use client'
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      smoothTouch: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (t: number) => { lenis.raf(t * 1000); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) lenis.stop()
    return () => { lenis.destroy() }
  }, [])
}
