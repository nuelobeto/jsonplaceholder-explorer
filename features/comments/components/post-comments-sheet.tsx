"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { loadPostComments } from "@/features/comments/actions"
import { CommentList } from "@/features/comments/components/comment-list"
import type { Post } from "@/features/posts/schemas"
import { useLazyList } from "@/hooks/use-lazy-list"

const CommentSkeleton = () => (
  <div className="flex gap-3 py-4">
    <Skeleton className="size-8 shrink-0 rounded-full" />
    <div className="w-full space-y-2">
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  </div>
)

export const PostCommentsSheet = ({
  post,
  onClose,
}: {
  post: Post | null
  onClose: () => void
}) => {
  const { items, isLoading, error } = useLazyList(
    post?.id ?? null,
    loadPostComments
  )

  return (
    <Sheet
      open={post !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <SheetContent className="w-full data-[side=right]:sm:max-w-lg">
        <SheetHeader className="border-b pr-12">
          <SheetTitle className="text-pretty first-letter:uppercase">
            {post?.title}
          </SheetTitle>
          <SheetDescription>
            {isLoading
              ? "Loading comments…"
              : error
                ? "Comments unavailable"
                : `${items.length} ${items.length === 1 ? "comment" : "comments"} on post #${post?.id}`}
          </SheetDescription>
        </SheetHeader>

        {/*
          min-h-0 lets this shrink inside the flex column so it can scroll, and
          tabIndex makes that scrolling reachable without a mouse.
        */}
        <div
          role="region"
          aria-label="Post and comments"
          tabIndex={0}
          className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {post && (
            <p className="rounded-lg bg-muted/50 p-3 text-sm text-pretty text-muted-foreground first-letter:uppercase">
              {post.body}
            </p>
          )}

          {error ? (
            <p className="mt-4 text-sm text-destructive">
              Couldn&apos;t load the comments for this post.
            </p>
          ) : isLoading ? (
            <div className="mt-2 divide-y">
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </div>
          ) : (
            <div className="mt-4">
              <CommentList comments={items} />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
