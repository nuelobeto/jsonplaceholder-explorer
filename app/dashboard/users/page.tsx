import { Suspense } from "react"
import type { Metadata } from "next"

import { buildMetadata } from "@/lib/seo"

import { SearchInput } from "@/components/dashboard/search-input"
import { UsersTable } from "@/features/users/components/users-table"
import { UsersTableSkeleton } from "@/features/users/components/users-table-skeleton"
import { getUsers } from "@/features/users/services"
import { filterUsers } from "@/features/users/utils"

export const metadata: Metadata = buildMetadata({
  title: "Users",
  description:
    "Browse and search the ten JSONPlaceholder users — contact details, company, and location.",
  path: "/dashboard/users",
})

/** Fetches and filters on the server; suspended so the skeleton can show. */
const UsersList = async ({ query }: { query: string }) => {
  const users = await getUsers()
  return <UsersTable users={filterUsers(users, query)} query={query} />
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = "" } = await searchParams

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Users
        </h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          The ten accounts behind every post, album, and todo in the API.
        </p>
      </header>

      <div className="mt-6">
        <SearchInput
          query={q}
          placeholder="Search by name, email, company…"
          label="Search users"
        />
      </div>

      {/* Keyed on the query so each search re-suspends into the skeleton. */}
      <Suspense key={q} fallback={<UsersTableSkeleton />}>
        <UsersList query={q} />
      </Suspense>
    </div>
  )
}
