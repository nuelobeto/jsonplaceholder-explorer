import type { User } from "./schema"

/** Every field the `?q=` search param is matched against. */
const searchableFields = (user: User) => [
  user.name,
  user.username,
  user.email,
  user.phone,
  user.website,
  user.company.name,
  user.address.city,
]

export const filterUsers = (users: User[], query: string): User[] => {
  const needle = query.trim().toLowerCase()
  if (!needle) return users

  return users.filter((user) =>
    searchableFields(user).some((field) => field.toLowerCase().includes(needle))
  )
}

/** "Mrs. Dennis Schulist" -> "DS". Titles are dropped so they never win a slot. */
export const getInitials = (name: string) =>
  name
    .replace(/^(mr|mrs|ms|miss|dr|prof)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("")
