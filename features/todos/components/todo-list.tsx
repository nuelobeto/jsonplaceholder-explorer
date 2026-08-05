import { CircleCheckIcon, CircleDashedIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { Todo } from "@/features/todos/schemas"

export const TodoList = ({ todos }: { todos: Todo[] }) => (
  <ul className="divide-y">
    {todos.map((todo) => (
      <li
        key={todo.id}
        className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
      >
        {todo.completed ? (
          <CircleCheckIcon aria-hidden className="size-4 shrink-0 text-brand" />
        ) : (
          <CircleDashedIcon
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground"
          />
        )}
        <span
          className={
            todo.completed
              ? "min-w-0 flex-1 text-muted-foreground line-through first-letter:uppercase"
              : "min-w-0 flex-1 first-letter:uppercase"
          }
        >
          {todo.title}
        </span>
        <Badge
          variant={todo.completed ? "secondary" : "outline"}
          className="shrink-0"
        >
          {todo.completed ? "Done" : "Pending"}
        </Badge>
      </li>
    ))}
  </ul>
)
