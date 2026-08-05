import { z } from "zod"

import { commentSchema } from "@/features/comments/schemas"
import { photoSchema } from "@/features/photos/schemas"
import { todoSchema } from "@/features/todos/schemas"
import { getUsers } from "@/features/users/services"
import { API_BASE_URL, REVALIDATE_SECONDS } from "@/lib/api"
import {
  HUE_FAMILIES,
  LIGHTNESS_BANDS,
  hexFromPhotoUrl,
  hexToHsl,
  hueFamilyOf,
  lightnessBandOf,
  type HueFamily,
  type LightnessBand,
} from "./color"

/**
 * These aggregations read whole collections (/photos is 5,000 rows), which is
 * only reasonable because the upstream response is cached for an hour and each
 * chart streams inside its own Suspense boundary.
 */
const getAll = async <T>(
  resource: string,
  schema: z.ZodType<T>
): Promise<T[]> => {
  const res = await fetch(`${API_BASE_URL}/${resource}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  })
  if (!res.ok) throw new Error(`Failed to fetch ${resource}: ${res.status}`)

  return z.array(schema).parse(await res.json())
}

export type CompletionRow = {
  userId: number
  name: string
  done: number
  total: number
}

/** The only per-user metric in this dataset that actually varies. */
export const getTodoCompletionByUser = async (): Promise<CompletionRow[]> => {
  const [users, todos] = await Promise.all([
    getUsers(),
    getAll("todos", todoSchema),
  ])

  return users
    .map((user) => {
      const owned = todos.filter((todo) => todo.userId === user.id)
      return {
        userId: user.id,
        name: user.name,
        done: owned.filter((todo) => todo.completed).length,
        total: owned.length,
      }
    })
    .sort((a, b) => b.done / b.total - a.done / a.total)
}

export type TldRow = { tld: string; count: number }

/** Commenter email domains — 496 distinct hosts, but only 12 distinct TLDs. */
export const getCommentTlds = async (): Promise<TldRow[]> => {
  const comments = await getAll("comments", commentSchema)

  const counts = new Map<string, number>()
  for (const comment of comments) {
    const tld = comment.email.split(".").pop()?.toLowerCase()
    if (tld) counts.set(tld, (counts.get(tld) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([tld, count]) => ({ tld: `.${tld}`, count }))
    .sort((a, b) => b.count - a.count)
}

export type LatestPost = {
  id: number
  title: string
  body: string
  author: string
  authorId: number
}

/** Newest-first by id — the only ordering this dataset can express. */
export const getLatestPosts = async (limit: number): Promise<LatestPost[]> => {
  const [posts, users] = await Promise.all([
    getAll(
      "posts",
      z.object({
        id: z.number(),
        userId: z.number(),
        title: z.string(),
        body: z.string(),
      })
    ),
    getUsers(),
  ])

  return posts
    .sort((a, b) => b.id - a.id)
    .slice(0, limit)
    .map((post) => ({
      id: post.id,
      title: post.title,
      body: post.body,
      authorId: post.userId,
      author:
        users.find((user) => user.id === post.userId)?.name ?? "Unknown author",
    }))
}

export type RecentComment = {
  id: number
  postId: number
  name: string
  email: string
}

export const getRecentComments = async (
  limit: number
): Promise<RecentComment[]> => {
  const comments = await getAll("comments", commentSchema)

  return comments
    .sort((a, b) => b.id - a.id)
    .slice(0, limit)
    .map(({ id, postId, name, email }) => ({ id, postId, name, email }))
}

export type LengthBucket = { label: string; count: number }

const TITLE_BUCKETS = [20, 30, 40, 50, 60, 70]

/** Post titles run 12–79 characters, so the spread is worth a distribution. */
export const getPostTitleLengths = async (): Promise<LengthBucket[]> => {
  const posts = await getAll(
    "posts",
    z.object({ id: z.number(), title: z.string() })
  )

  const buckets = TITLE_BUCKETS.map((upper, index) => ({
    label: index === 0 ? `<${upper}` : `${TITLE_BUCKETS[index - 1]}–${upper}`,
    upper,
    count: 0,
  }))
  const overflow = { label: `${TITLE_BUCKETS.at(-1)}+`, count: 0 }

  for (const post of posts) {
    const bucket = buckets.find((entry) => post.title.length < entry.upper)
    if (bucket) bucket.count += 1
    else overflow.count += 1
  }

  return [
    ...buckets.map(({ label, count }) => ({ label, count })),
    overflow,
  ].filter((bucket, index, all) => bucket.count > 0 || index < all.length - 1)
}

export type PaletteCell = {
  family: HueFamily
  band: LightnessBand
  count: number
}

export type PaletteGrid = {
  cells: PaletteCell[]
  max: number
  total: number
  unparsed: number
}

/** Every photo colour placed on a hue × lightness grid. */
export const getPhotoPalette = async (): Promise<PaletteGrid> => {
  const photos = await getAll("photos", photoSchema)

  const counts = new Map<string, number>()
  let unparsed = 0

  for (const photo of photos) {
    const hex = hexFromPhotoUrl(photo.thumbnailUrl)
    if (!hex) {
      unparsed += 1
      continue
    }
    const hsl = hexToHsl(hex)
    const key = `${hueFamilyOf(hsl)}|${lightnessBandOf(hsl)}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const cells = HUE_FAMILIES.flatMap((family) =>
    LIGHTNESS_BANDS.map((band) => ({
      family,
      band,
      count: counts.get(`${family}|${band}`) ?? 0,
    }))
  )

  return {
    cells,
    max: Math.max(...cells.map((cell) => cell.count), 0),
    total: photos.length - unparsed,
    unparsed,
  }
}
