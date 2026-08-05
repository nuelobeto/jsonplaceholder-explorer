// components/landing/api-preview.tsx
"use client"

import { motion, useReducedMotion, type Variants } from "motion/react"

type Tone = "key" | "string" | "number" | "comment"

/** A representative slice of GET /photos, rendered as syntax-coloured tokens. */
const responseLines: Array<Array<{ text: string; tone?: Tone }>> = [
  [{ text: "[" }],
  [{ text: "  {" }],
  [
    { text: '    "albumId"', tone: "key" },
    { text: ": " },
    { text: "1", tone: "number" },
    { text: "," },
  ],
  [
    { text: '    "id"', tone: "key" },
    { text: ": " },
    { text: "1", tone: "number" },
    { text: "," },
  ],
  [
    { text: '    "title"', tone: "key" },
    { text: ": " },
    { text: '"accusamus beatae ad facilis"', tone: "string" },
    { text: "," },
  ],
  [
    { text: '    "url"', tone: "key" },
    { text: ": " },
    { text: '"https://via.placeholder.com/600"', tone: "string" },
  ],
  [{ text: "  }," }],
  [{ text: "  { … 4,999 more }", tone: "comment" }],
  [{ text: "]" }],
]

const toneClass: Record<Tone, string> = {
  key: "text-brand",
  string: "text-brand-accent",
  number: "text-foreground",
  comment: "text-muted-foreground/70 italic",
}

const lineV: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.55 + i * 0.07, duration: 0.4, ease: "easeOut" },
  }),
}

export const ApiPreview = () => {
  const reduce = useReducedMotion()

  return (
    <div className="relative">
      {/* Brand glow pooling under the panel. */}
      <div
        aria-hidden
        className="absolute -inset-x-8 -bottom-6 -top-2 -z-10 rounded-[2rem] bg-brand/20 opacity-60 blur-3xl dark:bg-brand/25"
      />

      <div className="overflow-hidden rounded-2xl border bg-card/80 shadow-2xl shadow-brand/10 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/5">
        {/* Window chrome */}
        <div className="flex items-center gap-3 border-b bg-muted/50 px-4 py-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
          </div>
          <div className="mx-auto max-w-full truncate rounded-md bg-background/70 px-3 py-1 font-mono text-[11px] text-muted-foreground">
            jsonplaceholder.typicode.com/photos
          </div>
        </div>

        {/* Request line */}
        <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3 font-mono text-xs">
          <span className="rounded-md bg-brand/10 px-2 py-0.5 font-semibold text-brand">
            GET
          </span>
          <span className="text-muted-foreground">/photos?_limit=5000</span>
          <span className="ml-auto flex items-center gap-1.5 text-muted-foreground">
            <span
              className="size-1.5 rounded-full bg-brand-accent animate-blip"
              aria-hidden
            />
            200 · 48ms
          </span>
        </div>

        {/* Response body */}
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[11px] leading-relaxed sm:text-xs">
          <code>
            {responseLines.map((line, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={lineV}
                initial={reduce ? false : "hidden"}
                animate={reduce ? false : "show"}
                className="block whitespace-pre"
              >
                {line.map((token, j) => (
                  <span
                    key={j}
                    className={
                      token.tone ? toneClass[token.tone] : "text-muted-foreground"
                    }
                  >
                    {token.text}
                  </span>
                ))}
              </motion.span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}
