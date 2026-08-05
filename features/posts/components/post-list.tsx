"use client"

import { useState } from "react"
import { MessageSquareIcon } from "lucide-react"

import { PostCommentsSheet } from "@/features/comments/components/post-comments-sheet"
import type { Post } from "@/features/posts/schemas"

export const PostList = ({ posts }: { posts: Post[] }) => {
  const [selected, setSelected] = useState<Post | null>(null)

  return (
    <>
      <ul className="divide-y">
        {posts.map((post) => (
          <li key={post.id}>
            <button
              type="button"
              onClick={() => setSelected(post)}
              className="flex w-full gap-3 rounded-lg py-3 text-left transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="mt-0.5 font-mono text-xs text-muted-foreground">
                #{post.id}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium first-letter:uppercase">
                  {post.title}
                </span>
                <span className="mt-1 line-clamp-2 block text-sm text-pretty text-muted-foreground first-letter:uppercase">
                  {post.body}
                </span>
              </span>
              <span className="mt-0.5 flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                <MessageSquareIcon aria-hidden className="size-3.5" />
                <span className="sr-only">View comments</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <PostCommentsSheet post={selected} onClose={() => setSelected(null)} />
    </>
  )
}
