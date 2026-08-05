import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { ResourcePage } from "@/components/dashboard/resource-page"
import { TodoList } from "@/features/todos/components/todo-list"
import { todoSchema } from "@/features/todos/schemas"
import { ROUTES } from "@/lib/constants"
import { buildResourceHref, countPages, parsePageParam } from "@/lib/pagination"
import { fetchResourcePage } from "@/lib/resource-fetch"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Todos",
  description: "Search and page through all 200 JSONPlaceholder todos.",
  path: "/dashboard/todos",
})

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q = "", page } = await searchParams
  const requested = parsePageParam(page)

  const { items, total } = await fetchResourcePage("todos", todoSchema, {
    page: requested,
    query: q,
  })
  const totalPages = countPages(total)

  if (requested > totalPages && total > 0) {
    redirect(buildResourceHref(ROUTES.dashboard.todos, q, totalPages))
  }

  return (
    <ResourcePage
      title="Todos"
      description="Every task across all ten users."
      basePath={ROUTES.dashboard.todos}
      query={q}
      searchPlaceholder="Search todos by title…"
      noun="todo"
      pluralNoun="todos"
      total={total}
      currentPage={requested}
      totalPages={totalPages}
    >
      <div className="rounded-xl border bg-card p-4">
        <TodoList todos={items} />
      </div>
    </ResourcePage>
  )
}
