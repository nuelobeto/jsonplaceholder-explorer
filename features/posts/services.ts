import { z } from "zod"
import { API_BASE_URL, REVALIDATE_SECONDS } from "@/lib/api"
import { postSchema, type Post } from "./schemas"

/**
 * Every post belonging to a user, newest first. JSONPlaceholder has no
 * timestamps, so a descending id is the only "latest" the data can express.
 */
export const getPostsByUser = async (userId: number): Promise<Post[]> => {
  const res = await fetch(
    `${API_BASE_URL}/posts?userId=${userId}&_sort=id&_order=desc`,
    { next: { revalidate: REVALIDATE_SECONDS } }
  )
  if (!res.ok)
    throw new Error(`Failed to fetch posts for user ${userId}: ${res.status}`)

  return z.array(postSchema).parse(await res.json())
}
