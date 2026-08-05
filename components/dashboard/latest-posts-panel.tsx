import Link from "next/link"

import { PanelCard } from "@/components/dashboard/panel-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { LatestPost } from "@/features/analytics/services"
import { getInitials } from "@/features/users/utils"
import { ROUTES } from "@/lib/constants"

export const LatestPostsPanel = ({ posts }: { posts: LatestPost[] }) => (
  <PanelCard
    title="Latest posts"
    /* The repeated author is the data, not a bug: ids are allocated in blocks
       per user, so the ten highest post ids all belong to user 10. */
    description="Highest ids first — there are no timestamps, and ids are grouped by author, so the newest block belongs to one user."
    viewAllHref={ROUTES.dashboard.posts}
  >
    <ul className="divide-y">
      {posts.map((post) => (
        <li key={post.id} className="flex gap-3 py-3 first:pt-0">
          <Avatar className="mt-0.5 shrink-0">
            <AvatarFallback className="bg-linear-to-br from-brand/15 to-brand-accent/15 text-xs font-semibold text-foreground">
              {getInitials(post.author)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium first-letter:uppercase">
              {post.title}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              <Link
                href={ROUTES.dashboard.user(post.authorId)}
                className="hover:text-brand hover:underline"
              >
                {post.author}
              </Link>
            </p>
          </div>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            #{post.id}
          </span>
        </li>
      ))}
    </ul>
  </PanelCard>
)
