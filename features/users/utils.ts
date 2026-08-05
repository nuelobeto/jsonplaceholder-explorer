import { filterByQuery } from "@/lib/search"
import type { User } from "./schemas"

export const filterUsers = (users: User[], query: string): User[] =>
  filterByQuery(users, query, (user) => [
    user.name,
    user.username,
    user.email,
    user.phone,
    user.website,
    user.company.name,
    user.address.city,
  ])

/** Rejects "abc", "1.5", "-2" and "01" before they ever reach the network. */
export const parseUserId = (raw: string): number | null =>
  /^[1-9]\d*$/.test(raw) ? Number(raw) : null

/** "Mrs. Dennis Schulist" -> "DS". Titles are dropped so they never win a slot. */
export const getInitials = (name: string) =>
  name
    .replace(/^(mr|mrs|ms|miss|dr|prof)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("")
