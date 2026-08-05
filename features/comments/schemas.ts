import { z } from "zod"

export const commentSchema = z.object({
  postId: z.number(),
  id: z.number(),
  name: z.string(),
  email: z.string(),
  body: z.string(),
})

/** Named to stay clear of the DOM's global `Comment`. */
export type PostComment = z.infer<typeof commentSchema>
