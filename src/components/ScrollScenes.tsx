'use client'
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollScenes() {
  useSmoothScroll()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // SCENE 1: ABOUT – horizontal (desktop/tablet), vertical en mobile
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const track = document.querySelector<HTMLElement>('#about .about-track')
      const slides = gsap.utils.toArray<HTMLElement>('#about .about-slide')
      if (!track || slides.length <= 1) return

      gsap.to(track, {
        xPercent: -100 * (slides.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: '#about',
          start: 'top top',
          end: () => `+=${window.innerWidth * (slides.length - 1)}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / (slides.length - 1),
            duration: 0.3,
            ease: 'power1.inOut',
          },
        },
      })

      return () => mm.revert()
    })

    // SCENE 2: HERO / Tecnologías
    const tlHero = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '+=150%',
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
      defaults: { ease: 'none' },
    })
    tlHero
      .fromTo('#hero .hero-title', { y: 0, opacity: 1 }, { y: -80, opacity: 0.25 }, 0)
      .fromTo('#hero .hero-paragraph', { y: 0, opacity: 1 }, { y: -60, opacity: 0.3 }, 0)
      .fromTo('#hero .cards-grid', { scale: 0.95, opacity: 0.75 }, { scale: 1.05, opacity: 1 }, 0)

    // SCENE 3: Tech Ring
    const tlRing = gsap.timeline({
      scrollTrigger: {
        trigger: '#tech-ring',
        start: 'top top',
        end: '+=140%',
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
      defaults: { ease: 'none' },
    })
    tlRing.fromTo('#tech-ring .ring-wrap', { scale: 0.9, y: 60, opacity: 0.6 }, { scale: 1.06, y: -20, opacity: 1 }, 0)

    // cleanup
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
      gsap.globalTimeline.clear()
    }
  }, [])

  return null
}
