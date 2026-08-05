"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react"
import { Container } from "@/components/container"
import { buttonVariants } from "@/components/ui/button"
import { ApiPreview } from "@/components/landing/api-preview"
import { cn } from "@/lib/utils"

const containerV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const itemV: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

const stats = [
  { value: "6", label: "resources" },
  { value: "5,860", label: "records" },
  { value: "0", label: "API keys" },
]

export const Hero = () => {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  // Drift the preview panel as the hero scrolls away.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const rawY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const panelY = useSpring(rawY, { stiffness: 120, damping: 30, mass: 0.4 })
  const panelOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25])

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32"
    >
      {/* Blueprint grid, faded out towards the edges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-grid mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)] opacity-60"
      />
      {/* Aurora wash. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Sized down on small screens so the wash doesn't swamp the viewport. */}
        <div className="absolute -top-40 left-1/2 size-96 -translate-x-1/2 animate-aurora rounded-full bg-brand/15 blur-[110px] md:size-144 md:bg-brand/20 dark:bg-brand/20 md:dark:bg-brand/25" />
        <div className="absolute -top-24 right-[12%] size-72 animate-aurora rounded-full bg-brand-accent/15 blur-[100px] [animation-delay:-7s] md:size-104 md:bg-brand-accent/20" />
      </div>

      <Container>
        <motion.div
          variants={containerV}
          initial={reduce ? false : "hidden"}
          animate={reduce ? false : "show"}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <motion.span
            variants={itemV}
            className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
          >
            <span
              aria-hidden
              className="size-1.5 animate-blip rounded-full bg-brand"
            />
            A demo built on JSONPlaceholder
          </motion.span>

          <motion.h1
            variants={itemV}
            className="mt-6 text-4xl font-semibold tracking-tight text-balance md:text-6xl"
          >
            Explore the JSONPlaceholder API,{" "}
            <span className="animate-shimmer text-brand-gradient">
              visually.
            </span>
          </motion.h1>

          <motion.p
            variants={itemV}
            className="mt-5 max-w-xl text-pretty text-muted-foreground md:text-lg"
          >
            Browse users, posts, photos, albums, comments, and todos through a
            fast, typed dashboard — no setup, no API keys.
          </motion.p>

          <motion.div
            variants={itemV}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group h-11 gap-2 px-6 text-sm shadow-lg shadow-brand/20 transition-shadow hover:shadow-xl hover:shadow-brand/30"
              )}
            >
              Open the dashboard
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#features"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 px-6 text-sm backdrop-blur"
              )}
            >
              See features
            </Link>
          </motion.div>

          <motion.dl
            variants={itemV}
            className="mt-10 flex items-center gap-8 text-sm"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-1.5">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-semibold tabular-nums">{stat.value}</dd>
                <span aria-hidden className="text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Two layers: the outer one owns the scroll parallax, the inner one
            owns the entrance — sharing y/opacity on one element would let the
            scroll values clobber the entrance transition. */}
        <motion.div
          style={reduce ? undefined : { y: panelY, opacity: panelOpacity }}
          className="mx-auto mt-16 max-w-2xl"
        >
          <motion.div
            initial={
              reduce ? false : { opacity: 0, y: 48, filter: "blur(14px)" }
            }
            animate={reduce ? false : { opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <ApiPreview />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
