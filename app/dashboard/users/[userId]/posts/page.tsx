import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ResourcePagination } from "@/components/dashboard/resource-pagination"
import { SearchInput } from "@/components/dashboard/search-input"
import { PostList } from "@/features/posts/components/post-list"
import { getPostsByUser } from "@/features/posts/services"
import { filterPosts } from "@/features/posts/utils"
import { ResourceEmpty } from "@/features/users/components/resource-empty"
import { UserResourceShell } from "@/features/users/components/user-resource-shell"
import { getUser } from "@/features/users/services"
import { parseUserId } from "@/features/users/utils"
import { ROUTES } from "@/lib/constants"
import { paginate, parsePageParam } from "@/lib/pagination"

type PageProps = {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ q?: string; page?: string }>
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { userId } = await params
  const id = parseUserId(userId)
  const user = id === null ? null : await getUser(id)

  return {
    title: user
      ? `Posts by ${user.name} · JSONPlaceholder Explorer`
      : "User not found · JSONPlaceholder Explorer",
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const { userId } = await params
  const { q = "", page } = await searchParams

  const id = parseUserId(userId)
  const user = id === null ? null : await getUser(id)
  if (!user) notFound()

  const posts = filterPosts(await getPostsByUser(user.id), q)
  const { items, currentPage, totalPages, total } = paginate(
    posts,
    parsePageParam(page)
  )

  const buildHref = (target: number) => {
    const next = new URLSearchParams()
    if (q) next.set("q", q)
    if (target > 1) next.set("page", String(target))
    const query = next.toString()
    return query
      ? `${ROUTES.dashboard.userPosts(user.id)}?${query}`
      : ROUTES.dashboard.userPosts(user.id)
  }

  return (
    <UserResourceShell
      user={user}
      title="Posts"
      description={`Everything ${user.name} has published.`}
    >
      <div className="mt-6">
        <SearchInput
          query={q}
          placeholder="Search posts by title or body…"
          label="Search posts"
        />
      </div>

      {total === 0 ? (
        <ResourceEmpty query={q} noun="posts" />
      ) : (
        <>
          <p aria-live="polite" className="mt-6 text-sm text-muted-foreground">
            {total} {total === 1 ? "post" : "posts"}
            {q && ` matching “${q}”`}
            {totalPages > 1 && ` · page ${currentPage} of ${totalPages}`}
          </p>
          <div className="mt-4 rounded-xl border bg-card p-4">
            <PostList posts={items} />
          </div>
          <ResourcePagination
            currentPage={currentPage}
            totalPages={totalPages}
            buildHref={buildHref}
          />
        </>
      )}
    </UserResourceShell>
  )
}
