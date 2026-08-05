import type { ReactNode } from "react"
import { SearchXIcon } from "lucide-react"

import { ResourcePagination } from "@/components/dashboard/resource-pagination"
import { SearchInput } from "@/components/dashboard/search-input"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { buildResourceHref } from "@/lib/pagination"

/**
 * Shared chrome for the top-level collection pages: heading, search box,
 * result summary, and pagination. The caller supplies only the list itself.
 */
export const ResourcePage = ({
  title,
  description,
  basePath,
  query,
  searchPlaceholder,
  noun,
  pluralNoun,
  total,
  currentPage,
  totalPages,
  children,
}: {
  title: string
  description: string
  basePath: string
  query: string
  searchPlaceholder: string
  noun: string
  pluralNoun: string
  total: number
  currentPage: number
  totalPages: number
  children: ReactNode
}) => (
  <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
    <header>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 max-w-prose text-sm text-muted-foreground">
        {description}
      </p>
    </header>

    <div className="mt-6">
      <SearchInput
        query={query}
        placeholder={searchPlaceholder}
        label={`Search ${pluralNoun}`}
      />
    </div>

    {total === 0 ? (
      <Empty className="mt-6 border bg-card/50 py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon />
          </EmptyMedia>
          <EmptyTitle>No {pluralNoun} found</EmptyTitle>
          <EmptyDescription>
            {query ? (
              <>
                Nothing matches <span className="font-medium">“{query}”</span>.
              </>
            ) : (
              <>There are no {pluralNoun} to show.</>
            )}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    ) : (
      <>
        <p aria-live="polite" className="mt-6 text-sm text-muted-foreground">
          {total.toLocaleString()} {total === 1 ? noun : pluralNoun}
          {query && ` matching “${query}”`}
          {totalPages > 1 && ` · page ${currentPage} of ${totalPages}`}
        </p>

        <div className="mt-4">{children}</div>

        <ResourcePagination
          currentPage={currentPage}
          totalPages={totalPages}
          buildHref={(page) => buildResourceHref(basePath, query, page)}
        />
      </>
    )}
  </div>
)
