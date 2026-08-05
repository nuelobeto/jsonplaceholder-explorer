import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { ResourcePage } from "@/components/dashboard/resource-page"
import { PostList } from "@/features/posts/components/post-list"
import { postSchema } from "@/features/posts/schemas"
import { ROUTES } from "@/lib/constants"
import { buildResourceHref, countPages, parsePageParam } from "@/lib/pagination"
import { fetchResourcePage } from "@/lib/resource-fetch"

export const metadata: Metadata = {
  title: "Posts · JSONPlaceholder Explorer",
  description: "Search and page through all 100 JSONPlaceholder posts.",
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q = "", page } = await searchParams
  const requested = parsePageParam(page)

  const { items, total } = await fetchResourcePage("posts", postSchema, {
    page: requested,
    query: q,
  })
  const totalPages = countPages(total)

  // A hand-typed ?page=999 lands past the end; send it to the last real page.
  if (requested > totalPages && total > 0) {
    redirect(buildResourceHref(ROUTES.dashboard.posts, q, totalPages))
  }

  return (
    <ResourcePage
      title="Posts"
      description="Every post in the API. Select one to read its comments."
      basePath={ROUTES.dashboard.posts}
      query={q}
      searchPlaceholder="Search posts by title or body…"
      noun="post"
      pluralNoun="posts"
      total={total}
      currentPage={requested}
      totalPages={totalPages}
    >
      <div className="rounded-xl border bg-card p-4">
        <PostList posts={items} />
      </div>
    </ResourcePage>
  )
}
