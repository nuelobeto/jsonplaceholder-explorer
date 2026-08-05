import { z } from "zod"
import { API_BASE_URL, REVALIDATE_SECONDS } from "@/lib/api"
import { photoSchema, type Photo } from "./schemas"

/** Every photo in an album — fifty apiece, delivered in one go. */
export const getPhotosByAlbum = async (albumId: number): Promise<Photo[]> => {
  const res = await fetch(`${API_BASE_URL}/photos?albumId=${albumId}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  })
  if (!res.ok)
    throw new Error(
      `Failed to fetch photos for album ${albumId}: ${res.status}`
    )

  return z.array(photoSchema).parse(await res.json())
}
