"use server"

import type { PostComment } from "./schemas"
import { getCommentsByPost } from "./services"

/** Fetched when the sheet opens, so no post pays for comments nobody reads. */
export const loadPostComments = async (
  postId: number
): Promise<PostComment[]> => {
  if (!Number.isInteger(postId) || postId < 1) {
    throw new Error(`Invalid post id: ${postId}`)
  }
  return getCommentsByPost(postId)
}
