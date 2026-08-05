import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { ResourcePage } from "@/components/dashboard/resource-page"
import { CommentList } from "@/features/comments/components/comment-list"
import { commentSchema } from "@/features/comments/schemas"
import { ROUTES } from "@/lib/constants"
import { buildResourceHref, countPages, parsePageParam } from "@/lib/pagination"
import { fetchResourcePage } from "@/lib/resource-fetch"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Comments",
  description: "Search and page through all 500 JSONPlaceholder comments.",
  path: "/dashboard/comments",
})

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q = "", page } = await searchParams
  const requested = parsePageParam(page)

  const { items, total } = await fetchResourcePage("comments", commentSchema, {
    page: requested,
    query: q,
  })
  const totalPages = countPages(total)

  if (requested > totalPages && total > 0) {
    redirect(buildResourceHref(ROUTES.dashboard.comments, q, totalPages))
  }

  return (
    <ResourcePage
      title="Comments"
      description="Every comment left on every post."
      basePath={ROUTES.dashboard.comments}
      query={q}
      searchPlaceholder="Search comments by name, email, or body…"
      noun="comment"
      pluralNoun="comments"
      total={total}
      currentPage={requested}
      totalPages={totalPages}
    >
      <div className="rounded-xl border bg-card p-4">
        <CommentList comments={items} showPost />
      </div>
    </ResourcePage>
  )
}
