import type { ReactNode } from "react"
import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/** A list panel: heading, rows, and an optional "view all" footer link. */
export const PanelCard = ({
  title,
  description,
  viewAllHref,
  viewAllLabel = "View all",
  children,
}: {
  title: string
  description?: string
  viewAllHref?: string
  viewAllLabel?: string
  children: ReactNode
}) => (
  <Card className="rounded-2xl shadow-sm">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      {description && (
        <p className="text-sm text-pretty text-muted-foreground">
          {description}
        </p>
      )}
    </CardHeader>
    <CardContent>{children}</CardContent>
    {viewAllHref && (
      <div className="px-(--card-spacing)">
        <Link
          href={viewAllHref}
          className="group flex items-center justify-end gap-1 border-t pt-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {viewAllLabel}
          <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    )}
  </Card>
)
