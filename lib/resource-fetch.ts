import { z } from "zod"

import { API_BASE_URL, REVALIDATE_SECONDS } from "./api"
import { PAGE_SIZE } from "./pagination"

export type ResourcePage<T> = { items: T[]; total: number }

/**
 * One page of a top-level collection, searched and paginated by the API rather
 * than in memory — /photos alone is 5,000 rows, so pulling the whole set just
 * to slice 20 out of it is not an option.
 *
 * json-server exposes `q` for full-text search and reports the *filtered* count
 * in `x-total-count`, so the two compose correctly.
 */
export const fetchResourcePage = async <T>(
  resource: string,
  schema: z.ZodType<T>,
  { page, query }: { page: number; query: string }
): Promise<ResourcePage<T>> => {
  const params = new URLSearchParams({
    _page: String(page),
    _limit: String(PAGE_SIZE),
  })
  const trimmed = query.trim()
  if (trimmed) params.set("q", trimmed)

  const res = await fetch(`${API_BASE_URL}/${resource}?${params}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  })
  if (!res.ok) throw new Error(`Failed to fetch ${resource}: ${res.status}`)

  return {
    items: z.array(schema).parse(await res.json()),
    total: Number(res.headers.get("x-total-count") ?? 0),
  }
}

/** Row count for a collection, without transferring the rows. */
export const fetchResourceCount = async (resource: string): Promise<number> => {
  const res = await fetch(`${API_BASE_URL}/${resource}?_limit=1`, {
    next: { revalidate: REVALIDATE_SECONDS },
  })
  if (!res.ok) throw new Error(`Failed to count ${resource}: ${res.status}`)

  return Number(res.headers.get("x-total-count") ?? 0)
}
