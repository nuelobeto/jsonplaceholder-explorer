import { filterByQuery } from "@/lib/search"
import type { Todo } from "./schemas"

/** "done"/"pending" are searchable so the status is filterable as text. */
export const filterTodos = (todos: Todo[], query: string) =>
  filterByQuery(todos, query, (todo) => [
    todo.id,
    todo.title,
    todo.completed ? "done completed" : "pending open",
  ])
