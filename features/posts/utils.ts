import { filterByQuery } from "@/lib/search"
import type { Post } from "./schemas"

export const filterPosts = (posts: Post[], query: string) =>
  filterByQuery(posts, query, (post) => [post.id, post.title, post.body])
