// components/landing/resources.tsx
"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import {
  Users,
  FileText,
  MessageSquare,
  Library,
  Image as ImageIcon,
  CircleCheck,
  type LucideIcon,
} from "lucide-react"
import { Container } from "@/components/container"
import { SectionHeading } from "@/components/landing/section-heading"
import { useReveal } from "@/components/landing/use-reveal"

gsap.registerPlugin(ScrollTrigger)

const resources: Array<{ name: string; count: number; icon: LucideIcon }> = [
  { name: "Users", count: 10, icon: Users },
  { name: "Posts", count: 100, icon: FileText },
  { name: "Comments", count: 500, icon: MessageSquare },
  { name: "Albums", count: 100, icon: Library },
  { name: "Photos", count: 5000, icon: ImageIcon },
  { name: "Todos", count: 200, icon: CircleCheck },
]

const format = (n: number) => n.toLocaleString("en-US")

/**
 * Counts up to `value` when scrolled into view. The final value is what
 * renders on the server, so it stays correct without JS and under
 * prefers-reduced-motion.
 */
const CountUp = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { n: 0 }
        gsap.to(counter, {
          n: value,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = format(Math.round(counter.n))
          },
          onComplete: () => {
            el.textContent = format(value)
          },
        })
      })
      return () => mm.revert()
    },
    { dependencies: [value] }
  )

  return (
    <span ref={ref} className="tabular-nums">
      {format(value)}
    </span>
  )
}

export const Resources = () => {
  const root = useReveal<HTMLElement>({ selector: ".reveal-item", scale: 0.97 })

  return (
    <section
      id="resources"
      ref={root}
      className="relative scroll-mt-16 overflow-hidden border-y bg-muted/40 py-24 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 size-120 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[100px]"
      />

      <Container>
        <SectionHeading
          eyebrow="Resources"
          title="Six resources to explore"
          description="Real, interconnected fake data — enough volume to make searching, sorting, and pagination feel real."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3">
          {resources.map((resource) => (
            <div
              key={resource.name}
              className="reveal-item group relative flex flex-col items-center overflow-hidden rounded-2xl border bg-background p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-brand to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <resource.icon
                className="size-5 text-muted-foreground transition-colors duration-300 group-hover:text-brand"
                aria-hidden
              />
              <span className="mt-3 text-3xl font-semibold tracking-tight">
                <CountUp value={resource.count} />
              </span>
              <span className="mt-1 text-sm text-muted-foreground">
                {resource.name}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
