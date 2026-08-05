import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/**
 * One resource preview on the user detail page: a heading, how many there are
 * in total, and a link through to the full searchable list.
 */
export const UserResourceCard = ({
  title,
  icon,
  total,
  viewMoreHref,
  emptyMessage,
  children,
}: {
  title: string
  icon: ReactNode
  total: number
  viewMoreHref: string
  emptyMessage: string
  children: ReactNode
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <span aria-hidden className="text-muted-foreground [&>svg]:size-4">
          {icon}
        </span>
        {title}
        <Badge variant="secondary">{total}</Badge>
      </CardTitle>
      <CardAction>
        <Link
          href={viewMoreHref}
          className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          View more
          <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardAction>
    </CardHeader>
    <CardContent>
      {total === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        children
      )}
    </CardContent>
  </Card>
)
