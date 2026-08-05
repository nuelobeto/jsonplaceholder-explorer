/**
 * Canonical site URL.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL — set this in production; it is the only value that
 *     produces correct canonicals and absolute OG image URLs.
 *  2. VERCEL_PROJECT_PRODUCTION_URL — Vercel injects this automatically, so
 *     preview deploys still emit absolute URLs rather than pointing at
 *     localhost.
 *  3. localhost, for `next dev`.
 *
 * Metadata resolution needs an absolute origin: a relative OG image is dropped
 * by most crawlers, so getting this wrong silently breaks link previews.
 */
const resolveSiteUrl = (): string => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, "")

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`

  return "http://localhost:3000"
}

export const siteConfig = {
  name: "JSONPlaceholder Explorer",
  shortName: "JSONPlaceholder Explorer",
  url: resolveSiteUrl(),
  description:
    "A Next.js dashboard for the JSONPlaceholder API — browse and search 5,910 users, posts, comments, albums, photos and todos, with charts, maps and full keyboard access.",
  tagline: "Explore the JSONPlaceholder API",
  author: {
    name: "Nuel Obeto",
    url: "https://github.com/nuelobeto",
  },
  repository: "https://github.com/nuelobeto/jsonplaceholder-explorer",
  keywords: [
    "JSONPlaceholder",
    "Next.js dashboard",
    "REST API explorer",
    "React Server Components",
    "TypeScript",
    "data visualisation",
    "Tailwind CSS",
  ],
} as const

/** Brand hexes for the OG renderer — Satori can't resolve oklch() or CSS vars. */
export const ogBrand = {
  background: "#0a0a0a",
  foreground: "#ffffff",
  muted: "#a1a1a1",
  brand: "#a190ff",
  accent: "#3ecce2",
} as const
