import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

/**
 * Page numbers around the current one, with the first and last always present:
 * [1, "…", 4, 5, 6, "…", 20]. Anything under 8 pages is shown in full.
 */
const buildPages = (current: number, total: number): Array<number | "gap"> => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set([1, total, current, current - 1, current + 1])
  const visible = [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b)

  return visible.flatMap((page, index) =>
    index > 0 && page - visible[index - 1] > 1
      ? (["gap", page] as Array<number | "gap">)
      : [page]
  )
}

export const ResourcePagination = ({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number
  totalPages: number
  buildHref: (page: number) => string
}) => {
  if (totalPages <= 1) return null

  const arrow = (direction: "previous" | "next") => {
    const target = direction === "previous" ? currentPage - 1 : currentPage + 1
    const disabled =
      direction === "previous" ? currentPage <= 1 : currentPage >= totalPages
    const Icon = direction === "previous" ? ChevronLeftIcon : ChevronRightIcon

    return disabled ? (
      <span
        aria-disabled
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "pointer-events-none opacity-40"
        )}
      >
        <Icon />
        <span className="sr-only">{direction} page</span>
      </span>
    ) : (
      <Link
        href={buildHref(target)}
        rel={direction}
        scroll={false}
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <Icon />
        <span className="sr-only">{direction} page</span>
      </Link>
    )
  }

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>{arrow("previous")}</PaginationItem>

        {buildPages(currentPage, totalPages).map((page, index) =>
          page === "gap" ? (
            <PaginationItem
              key={`gap-${index}`}
              aria-hidden
              className="px-2 text-sm text-muted-foreground"
            >
              …
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <Link
                href={buildHref(page)}
                scroll={false}
                aria-current={page === currentPage ? "page" : undefined}
                aria-label={`Page ${page}`}
                className={buttonVariants({
                  variant: page === currentPage ? "outline" : "ghost",
                  size: "icon",
                })}
              >
                {page}
              </Link>
            </PaginationItem>
          )
        )}

        <PaginationItem>{arrow("next")}</PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
