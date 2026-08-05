import { z } from "zod"
import { userSchema, type User } from "./schemas"

const BASE_URL = "https://jsonplaceholder.typicode.com"

export const getUsers = async (): Promise<User[]> => {
  const res = await fetch(`${BASE_URL}/users`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`)
  return z.array(userSchema).parse(await res.json())
}

/** Resolves to `null` for an id that doesn't exist, so callers can 404 cleanly. */
export const getUser = async (id: number): Promise<User | null> => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    next: { revalidate: 3600 },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Failed to fetch user ${id}: ${res.status}`)
  return userSchema.parse(await res.json())
}
