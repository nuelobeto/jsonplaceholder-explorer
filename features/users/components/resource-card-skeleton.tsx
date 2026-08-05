import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/** Placeholder for a resource section while its fetch is in flight. */
export const ResourceCardSkeleton = ({ rows }: { rows: number }) => (
  <Card aria-hidden>
    <CardHeader className="flex flex-row items-center justify-between">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-5 w-20" />
    </CardHeader>
    <CardContent className="space-y-3">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      ))}
    </CardContent>
  </Card>
)
