import Link from "next/link"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { PostComment } from "@/features/comments/schemas"
import { ROUTES } from "@/lib/constants"

/**
 * Shared by the per-post sheet and the global comments page. `showPost` adds a
 * link back to the post, which only makes sense away from that post's sheet.
 */
export const CommentList = ({
  comments,
  showPost = false,
}: {
  comments: PostComment[]
  showPost?: boolean
}) => (
  <ul className="divide-y">
    {comments.map((comment) => (
      <li key={comment.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
        <Avatar className="mt-0.5 shrink-0">
          <AvatarFallback className="bg-linear-to-br from-brand/15 to-brand-accent/15 text-xs font-semibold text-foreground">
            {comment.email.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-medium text-pretty first-letter:uppercase">
            {comment.name}
          </p>
          <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
            <a
              href={`mailto:${comment.email}`}
              className="break-all hover:text-brand hover:underline"
            >
              {comment.email}
            </a>
            {showPost && (
              <>
                <span aria-hidden>·</span>
                <Link
                  href={ROUTES.dashboard.posts}
                  className="font-mono hover:text-brand hover:underline"
                >
                  post #{comment.postId}
                </Link>
              </>
            )}
          </div>
          <p className="mt-1.5 text-sm text-pretty text-muted-foreground first-letter:uppercase">
            {comment.body}
          </p>
        </div>
      </li>
    ))}
  </ul>
)
