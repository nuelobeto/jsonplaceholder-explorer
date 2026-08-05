// components/landing/about.tsx
"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/container"
import { SectionHeading } from "@/components/landing/section-heading"
import { useReveal } from "@/components/landing/use-reveal"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const stack = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "GSAP",
  "Motion",
  "Playwright",
  "Vitest",
  "Lighthouse CI",
]

export const About = () => {
  const root = useReveal<HTMLElement>({ selector: ".reveal-item", start: "top 75%" })

  return (
    <section id="about" ref={root} className="scroll-mt-16 py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="About" title="Why this exists" />

        <div className="mx-auto mt-6 max-w-2xl space-y-4 text-center text-muted-foreground">
          <p className="reveal-item text-pretty">
            JSONPlaceholder Explorer is a demo project — a real-world front end
            built on a public fake API. It shows how to fetch, model, and
            present interconnected data with Next.js, and it doubles as a
            testbed for testing, accessibility, and performance patterns.
          </p>
          <p className="reveal-item text-pretty">
            No accounts, no keys, no backend to run. Open the dashboard and
            start exploring.
          </p>
        </div>

        <ul className="reveal-item mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2">
          {stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border bg-card/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>

        {/* Closing CTA — gradient hairline border via a padded wrapper. */}
        <div className="reveal-item mx-auto mt-16 max-w-3xl rounded-3xl bg-linear-to-br from-brand/40 via-brand-accent/25 to-transparent p-px">
          <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-background px-6 py-12 text-center sm:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-brand/15 blur-[80px]"
            />
            <div className="relative">
              <h3 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
                Ready to poke at 5,860 records?
              </h3>
              <p className="mx-auto mt-3 max-w-md text-pretty text-sm text-muted-foreground">
                The dashboard is open — nothing to install, nothing to sign up
                for.
              </p>
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group mt-7 h-11 gap-2 px-6 text-sm shadow-lg shadow-brand/20 transition-shadow hover:shadow-xl hover:shadow-brand/30"
                )}
              >
                Open the dashboard
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
