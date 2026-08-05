export const PAGE_SIZE = 20

/** Anything that isn't a positive integer falls back to page 1. */
export const parsePageParam = (raw?: string): number => {
  const page = Number(raw)
  return Number.isInteger(page) && page > 0 ? page : 1
}

/** Page 1 and an empty query are the defaults, so they stay out of the URL. */
export const buildResourceHref = (
  basePath: string,
  query: string,
  page: number
): string => {
  const params = new URLSearchParams()
  if (query) params.set("q", query)
  if (page > 1) params.set("page", String(page))
  const search = params.toString()

  return search ? `${basePath}?${search}` : basePath
}

export const countPages = (total: number): number =>
  Math.max(1, Math.ceil(total / PAGE_SIZE))

export type Paginated<T> = {
  items: T[]
  currentPage: number
  totalPages: number
  total: number
}

export const paginate = <T>(items: T[], page: number): Paginated<T> => {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  // Clamp so a hand-typed ?page=99 shows the last page instead of nothing.
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE

  return {
    items: items.slice(start, start + PAGE_SIZE),
    currentPage,
    totalPages,
    total: items.length,
  }
}
