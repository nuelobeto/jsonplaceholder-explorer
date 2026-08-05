import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SearchInput } from "@/components/dashboard/search-input"
import { AlbumsInfiniteList } from "@/features/albums/components/albums-infinite-list"
import { getAlbumsByUser } from "@/features/albums/services"
import { filterAlbums } from "@/features/albums/utils"
import { ResourceEmpty } from "@/features/users/components/resource-empty"
import { UserResourceShell } from "@/features/users/components/user-resource-shell"
import { getUser } from "@/features/users/services"
import { parseUserId } from "@/features/users/utils"
import { PAGE_SIZE } from "@/lib/pagination"

type PageProps = {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ q?: string }>
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { userId } = await params
  const id = parseUserId(userId)
  const user = id === null ? null : await getUser(id)

  return {
    title: user
      ? `Albums by ${user.name} · JSONPlaceholder Explorer`
      : "User not found · JSONPlaceholder Explorer",
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const { userId } = await params
  const { q = "" } = await searchParams

  const id = parseUserId(userId)
  const user = id === null ? null : await getUser(id)
  if (!user) notFound()

  // The first batch is server-rendered; scrolling fetches the rest.
  const albums = filterAlbums(await getAlbumsByUser(user.id), q)
  const initialItems = albums.slice(0, PAGE_SIZE)

  return (
    <UserResourceShell
      user={user}
      title="Albums"
      description={`Every album ${user.name} has created, loaded as you scroll.`}
    >
      <div className="mt-6">
        <SearchInput
          query={q}
          placeholder="Search albums by title…"
          label="Search albums"
        />
      </div>

      {albums.length === 0 ? (
        <ResourceEmpty query={q} noun="albums" />
      ) : (
        <>
          <p aria-live="polite" className="mt-6 text-sm text-muted-foreground">
            {albums.length} {albums.length === 1 ? "album" : "albums"}
            {q && ` matching “${q}”`}
          </p>
          {/* Keyed on the query so a new search resets the loaded batches. */}
          <AlbumsInfiniteList
            key={q}
            userId={user.id}
            query={q}
            initialItems={initialItems}
            initialHasMore={albums.length > initialItems.length}
            total={albums.length}
          />
        </>
      )}
    </UserResourceShell>
  )
}
