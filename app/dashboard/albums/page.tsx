import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { ResourcePage } from "@/components/dashboard/resource-page"
import { AlbumList } from "@/features/albums/components/album-list"
import { albumSchema } from "@/features/albums/schemas"
import { ROUTES } from "@/lib/constants"
import { buildResourceHref, countPages, parsePageParam } from "@/lib/pagination"
import { fetchResourcePage } from "@/lib/resource-fetch"

export const metadata: Metadata = {
  title: "Albums · JSONPlaceholder Explorer",
  description: "Search and page through all 100 JSONPlaceholder albums.",
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q = "", page } = await searchParams
  const requested = parsePageParam(page)

  const { items, total } = await fetchResourcePage("albums", albumSchema, {
    page: requested,
    query: q,
  })
  const totalPages = countPages(total)

  if (requested > totalPages && total > 0) {
    redirect(buildResourceHref(ROUTES.dashboard.albums, q, totalPages))
  }

  return (
    <ResourcePage
      title="Albums"
      description="Every album in the API. Select one to browse its photos."
      basePath={ROUTES.dashboard.albums}
      query={q}
      searchPlaceholder="Search albums by title…"
      noun="album"
      pluralNoun="albums"
      total={total}
      currentPage={requested}
      totalPages={totalPages}
    >
      <AlbumList albums={items} />
    </ResourcePage>
  )
}
