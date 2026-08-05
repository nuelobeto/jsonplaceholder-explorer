import { z } from "zod"

export const albumSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
})

export type Album = z.infer<typeof albumSchema>
