import { z } from "zod"
import { API_BASE_URL, REVALIDATE_SECONDS } from "@/lib/api"
import { todoSchema, type Todo } from "./schemas"

/** Every todo belonging to a user, newest first. */
export const getTodosByUser = async (userId: number): Promise<Todo[]> => {
  const res = await fetch(
    `${API_BASE_URL}/todos?userId=${userId}&_sort=id&_order=desc`,
    { next: { revalidate: REVALIDATE_SECONDS } }
  )
  if (!res.ok)
    throw new Error(`Failed to fetch todos for user ${userId}: ${res.status}`)

  return z.array(todoSchema).parse(await res.json())
}
