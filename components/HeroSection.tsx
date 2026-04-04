'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export function HeroSection() {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const line1 = el.querySelector('.h-l1')
    const line2 = el.querySelector('.h-l2')
    const sub   = el.querySelector('.h-sub')

    if (!line1 || !line2 || !sub) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) return

    // Set start states
    gsap.set(line1, { yPercent: 110 })
    gsap.set(line2, { yPercent: 110 })
    gsap.set(sub,   { opacity: 0, y: 20 })

    // Timeline
    const tl = gsap.timeline({ delay: 0.2 })

    tl.to(line1, {
      yPercent: 0,
      duration: 1.1,
      ease: 'power4.out',
    })
    .to(line2, {
      yPercent: 0,
      duration: 1.1,
      ease: 'power4.out',
    }, '-=0.75')
    .to(sub, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.35')

    return () => { tl.kill() }
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative min-h-[80vh] md:min-h-[82vh] flex items-center justify-center overflow-hidden px-6"
    >
      {/* SEO h1 */}
      <h1 className="sr-only">
        Mental clarity tools for anxiety, focus, and overwhelm
      </h1>

      {/* Headline */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Line 1 clip */}
        <div className="overflow-hidden">
          <div
            className="h-l1 text-[45px] md:text-[72px] font-light leading-[0.95] text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            When your mind is too&nbsp;full
          </div>
        </div>

        {/* Line 2 clip */}
        <div className="mt-1 overflow-hidden md:mt-2">
          <div
            className="h-l2 text-[45px] md:text-[72px] italic font-light leading-[0.95] text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            to think clearly.
          </div>
        </div>

        {/* Subtext */}
        <p className="h-sub mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/70 [font-family:var(--font-jost)] md:text-lg">
          Solace helps you find the next right step —
          through thought, not noise.
        </p>
      </div>
    </section>
  )
}
