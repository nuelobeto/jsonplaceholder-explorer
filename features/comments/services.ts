import { z } from "zod"
import { API_BASE_URL, REVALIDATE_SECONDS } from "@/lib/api"
import { commentSchema, type PostComment } from "./schemas"

/** Every comment on a post — five apiece, so there is nothing to paginate. */
export const getCommentsByPost = async (
  postId: number
): Promise<PostComment[]> => {
  const res = await fetch(`${API_BASE_URL}/comments?postId=${postId}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  })
  if (!res.ok)
    throw new Error(
      `Failed to fetch comments for post ${postId}: ${res.status}`
    )

  return z.array(commentSchema).parse(await res.json())
}
