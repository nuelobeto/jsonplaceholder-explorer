import { Skeleton } from "@/components/ui/skeleton"

const ROWS = 10

const rows = Array.from({ length: ROWS }, (_, index) => index)

/** Mirrors both layouts in {@link ./users-table.tsx} so nothing shifts on load. */
export const UsersTableSkeleton = () => (
  <div className="mt-6" aria-hidden>
    <Skeleton className="h-5 w-20" />

    <ul className="mt-4 grid gap-3 md:hidden">
      {rows.map((row) => (
        <li key={row} className="rounded-xl border bg-card p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2 py-0.5">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-3.5 w-1/4" />
            </div>
            <Skeleton className="h-5 w-8 rounded-4xl" />
          </div>
          <div className="mt-4 space-y-2.5">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/5" />
          </div>
        </li>
      ))}
    </ul>

    <div className="mt-4 hidden overflow-hidden rounded-xl border bg-card md:block">
      <div className="h-10 border-b bg-muted/40" />
      {rows.map((row) => (
        <div
          key={row}
          className="flex items-center gap-4 border-b p-4 last:border-0"
        >
          <div className="flex flex-1 items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="w-full space-y-2">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
          </div>
          {[0, 1, 2, 3].map((column) => (
            <div key={column} className="flex-1 space-y-2">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
)
