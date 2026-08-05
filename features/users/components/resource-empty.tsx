import { SearchXIcon } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export const ResourceEmpty = ({
  query,
  noun,
}: {
  query: string
  noun: string
}) => (
  <Empty className="mt-6 border bg-card/50 py-16">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <SearchXIcon />
      </EmptyMedia>
      <EmptyTitle>No {noun} found</EmptyTitle>
      <EmptyDescription>
        {query ? (
          <>
            Nothing matches <span className="font-medium">“{query}”</span>.
          </>
        ) : (
          <>This user has no {noun}.</>
        )}
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
)
