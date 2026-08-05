import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ResourcePagination } from "@/components/dashboard/resource-pagination"
import { SearchInput } from "@/components/dashboard/search-input"
import { TodoList } from "@/features/todos/components/todo-list"
import { getTodosByUser } from "@/features/todos/services"
import { filterTodos } from "@/features/todos/utils"
import { ResourceEmpty } from "@/features/users/components/resource-empty"
import { UserResourceShell } from "@/features/users/components/user-resource-shell"
import { getUser } from "@/features/users/services"
import { parseUserId } from "@/features/users/utils"
import { ROUTES } from "@/lib/constants"
import { buildMetadata } from "@/lib/seo"
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

  if (!user) return { title: "User not found", robots: { index: false } }

  return buildMetadata({
    title: `Todos for ${user.name}`,
    description: `Every task assigned to ${user.name} — searchable and paginated.`,
    path: ROUTES.dashboard.userTodos(user.id),
  })
}

export default async function Page({ params, searchParams }: PageProps) {
  const { userId } = await params
  const { q = "", page } = await searchParams

  const id = parseUserId(userId)
  const user = id === null ? null : await getUser(id)
  if (!user) notFound()

  const all = await getTodosByUser(user.id)
  const todos = filterTodos(all, q)
  const { items, currentPage, totalPages, total } = paginate(
    todos,
    parsePageParam(page)
  )
  const completed = all.filter((todo) => todo.completed).length

  const buildHref = (target: number) => {
    const next = new URLSearchParams()
    if (q) next.set("q", q)
    if (target > 1) next.set("page", String(target))
    const query = next.toString()
    return query
      ? `${ROUTES.dashboard.userTodos(user.id)}?${query}`
      : ROUTES.dashboard.userTodos(user.id)
  }

  return (
    <UserResourceShell
      user={user}
      title="Todos"
      description={`${completed} of ${all.length} complete.`}
    >
      <div className="mt-6">
        <SearchInput
          query={q}
          placeholder="Search todos by title or status…"
          label="Search todos"
        />
      </div>

      {total === 0 ? (
        <ResourceEmpty query={q} noun="todos" />
      ) : (
        <>
          <p aria-live="polite" className="mt-6 text-sm text-muted-foreground">
            {total} {total === 1 ? "todo" : "todos"}
            {q && ` matching “${q}”`}
            {totalPages > 1 && ` · page ${currentPage} of ${totalPages}`}
          </p>
          <div className="mt-4 rounded-xl border bg-card p-4">
            <TodoList todos={items} />
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
