// components/landing/features.tsx
"use client"

import type { MouseEvent } from "react"
import { Layers, Search, LayoutDashboard, Zap, type LucideIcon } from "lucide-react"
import { Container } from "@/components/container"
import { SectionHeading } from "@/components/landing/section-heading"
import { useReveal } from "@/components/landing/use-reveal"

const features: Array<{ title: string; body: string; icon: LucideIcon }> = [
  {
    title: "Every resource",
    body: "Users, posts, comments, albums, photos, and todos — all six JSONPlaceholder resources in one place.",
    icon: Layers,
  },
  {
    title: "Search, sort, paginate",
    body: "Client-side filtering across large lists, including the 5,000-item photos endpoint.",
    icon: Search,
  },
  {
    title: "Interactive dashboard",
    body: "An overview with live counts and drill-downs into each resource type.",
    icon: LayoutDashboard,
  },
  {
    title: "Fast & typed",
    body: "Built on Next.js Server Components with end-to-end TypeScript.",
    icon: Zap,
  },
]

/** Park the cursor position on the card so the spotlight can follow it. */
const trackPointer = (event: MouseEvent<HTMLDivElement>) => {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`)
}

export const Features = () => {
  const root = useReveal<HTMLElement>({ selector: ".reveal-item", y: 36 })

  return (
    <section id="features" ref={root} className="scroll-mt-16 py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Features"
          title="What you can do"
          description="A small surface area, built to show the patterns that matter."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              onMouseMove={trackPointer}
              className="reveal-item group relative overflow-hidden rounded-2xl border bg-card/50 p-6 transition-colors duration-300 hover:border-brand/40"
            >
              {/* Cursor-following spotlight. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, var(--brand), transparent 88%), transparent 70%)",
                }}
              />

              <div className="relative">
                <span className="inline-flex size-10 items-center justify-center rounded-xl border bg-background text-brand transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                  <feature.icon className="size-[18px]" aria-hidden />
                </span>
                <h3 className="mt-4 font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
