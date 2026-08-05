"use server"

import { PAGE_SIZE } from "@/lib/pagination"
import type { Album } from "./schemas"
import { getAlbumsByUser } from "./services"
import { filterAlbums } from "./utils"

export type AlbumPage = { items: Album[]; hasMore: boolean }

/**
 * One batch for the infinite-scroll list. Arguments arrive straight from the
 * browser, so the id is re-validated here rather than trusted.
 */
export const loadAlbumPage = async (
  userId: number,
  query: string,
  offset: number
): Promise<AlbumPage> => {
  if (!Number.isInteger(userId) || userId < 1) {
    throw new Error(`Invalid user id: ${userId}`)
  }
  const start = Number.isInteger(offset) && offset > 0 ? offset : 0

  const albums = filterAlbums(
    await getAlbumsByUser(userId),
    String(query ?? "")
  )
  const items = albums.slice(start, start + PAGE_SIZE)

  return { items, hasMore: start + items.length < albums.length }
}
