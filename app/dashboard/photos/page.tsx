import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { ResourcePage } from "@/components/dashboard/resource-page"
import { PhotoTile } from "@/features/photos/components/photo-tile"
import { photoSchema } from "@/features/photos/schemas"
import { ROUTES } from "@/lib/constants"
import { buildResourceHref, countPages, parsePageParam } from "@/lib/pagination"
import { fetchResourcePage } from "@/lib/resource-fetch"

export const metadata: Metadata = {
  title: "Photos · JSONPlaceholder Explorer",
  description: "Search and page through all 5,000 JSONPlaceholder photos.",
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q = "", page } = await searchParams
  const requested = parsePageParam(page)

  const { items, total } = await fetchResourcePage("photos", photoSchema, {
    page: requested,
    query: q,
  })
  const totalPages = countPages(total)

  if (requested > totalPages && total > 0) {
    redirect(buildResourceHref(ROUTES.dashboard.photos, q, totalPages))
  }

  return (
    <ResourcePage
      title="Photos"
      description="The largest collection in the API — 5,000 rows, 20 at a time."
      basePath={ROUTES.dashboard.photos}
      query={q}
      searchPlaceholder="Search photos by title…"
      noun="photo"
      pluralNoun="photos"
      total={total}
      currentPage={requested}
      totalPages={totalPages}
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((photo) => (
          <li key={photo.id}>
            <PhotoTile photo={photo} />
          </li>
        ))}
      </ul>
    </ResourcePage>
  )
}
