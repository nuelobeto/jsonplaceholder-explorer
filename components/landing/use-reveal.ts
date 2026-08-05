// components/landing/use-reveal.ts
"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

type RevealOptions = {
  /** Scoped selector for the elements to reveal. */
  selector: string
  y?: number
  blur?: number
  scale?: number
  stagger?: number
  duration?: number
  start?: string
}

/**
 * Scroll-triggered reveal shared by every landing section, so the sections
 * enter with one consistent curve instead of four hand-tuned variations.
 * Animations are skipped entirely under prefers-reduced-motion.
 */
export const useReveal = <T extends HTMLElement>({
  selector,
  y = 28,
  blur = 8,
  scale = 1,
  stagger = 0.09,
  duration = 0.75,
  start = "top 80%",
}: RevealOptions) => {
  const root = useRef<T>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = root.current?.querySelectorAll<HTMLElement>(selector)
        if (!targets?.length) return

        // An explicit set + to rather than gsap.from(): a `from` tween gets
        // reverted to its start values whenever something else forces a
        // ScrollTrigger refresh (the count-up triggers do), which left
        // sections stranded at opacity 0.
        gsap.set(targets, { opacity: 0, y, scale, filter: `blur(${blur}px)` })
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration,
          stagger,
          ease: "power3.out",
          // Hand the properties back to CSS so hover transforms aren't
          // outranked by GSAP's inline styles.
          clearProps: "opacity,transform,filter",
          scrollTrigger: { trigger: root.current, start, once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return root
}
