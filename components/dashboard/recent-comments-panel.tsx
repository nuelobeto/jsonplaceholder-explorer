import { PanelCard } from "@/components/dashboard/panel-card"
import type { RecentComment } from "@/features/analytics/services"
import { ROUTES } from "@/lib/constants"

/** Timeline treatment: a hued dot per row, connected by a hairline rail. */
export const RecentCommentsPanel = ({
  comments,
}: {
  comments: RecentComment[]
}) => (
  <PanelCard
    title="Recent comments"
    /* Same story as the posts panel: comment ids run in blocks of five per
       post, so the top five all sit on the last post. */
    description="The five highest comment ids — ids run in blocks of five per post, so these all sit on post #100."
    viewAllHref={ROUTES.dashboard.comments}
  >
    <ol className="relative">
      {comments.map((comment, index) => (
        <li key={comment.id} className="relative flex gap-3 pb-4 last:pb-0">
          {/* The rail stops at the last dot rather than dangling past it. */}
          {index < comments.length - 1 && (
            <span
              aria-hidden
              className="absolute top-3 bottom-0 left-1 w-px bg-border"
            />
          )}
          <span
            aria-hidden
            className="relative mt-1.5 size-2 shrink-0 rounded-full"
            style={{ background: `var(--viz-${(index % 6) + 1})` }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium first-letter:uppercase">
              {comment.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {comment.email} · post #{comment.postId}
            </p>
          </div>
        </li>
      ))}
    </ol>
  </PanelCard>
)
