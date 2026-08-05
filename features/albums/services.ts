import { z } from "zod"
import { API_BASE_URL, REVALIDATE_SECONDS } from "@/lib/api"
import { albumSchema, type Album } from "./schemas"

/** Every album belonging to a user, newest first. */
export const getAlbumsByUser = async (userId: number): Promise<Album[]> => {
  const res = await fetch(
    `${API_BASE_URL}/albums?userId=${userId}&_sort=id&_order=desc`,
    { next: { revalidate: REVALIDATE_SECONDS } }
  )
  if (!res.ok)
    throw new Error(`Failed to fetch albums for user ${userId}: ${res.status}`)

  return z.array(albumSchema).parse(await res.json())
}
