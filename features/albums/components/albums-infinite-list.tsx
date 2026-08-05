"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { loadAlbumPage } from "@/features/albums/actions"
import { AlbumList } from "@/features/albums/components/album-list"
import type { Album } from "@/features/albums/schemas"

/** Start fetching before the sentinel is actually on screen. */
const ROOT_MARGIN = "300px"

export const AlbumsInfiniteList = ({
  userId,
  query,
  initialItems,
  initialHasMore,
  total,
}: {
  userId: number
  query: string
  initialItems: Album[]
  initialHasMore: boolean
  total: number
}) => {
  const [items, setItems] = useState(initialItems)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  // A ref, not the isLoading state: the observer can fire again before a
  // re-render lands, which would fetch the same offset twice.
  const inFlight = useRef(false)

  const loadMore = useCallback(async () => {
    if (inFlight.current || !hasMore) return

    inFlight.current = true
    setIsLoading(true)
    setError(null)

    try {
      const page = await loadAlbumPage(userId, query, items.length)
      setItems((current) => [...current, ...page.items])
      setHasMore(page.hasMore)
    } catch {
      setError("Couldn't load more albums.")
    } finally {
      inFlight.current = false
      setIsLoading(false)
    }
  }, [hasMore, items.length, query, userId])

  useEffect(() => {
    const sentinel = sentinelRef.current
    // Nothing left to fetch, or a failure is waiting on a manual retry.
    if (!sentinel || !hasMore || error) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore()
      },
      { rootMargin: ROOT_MARGIN }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, error, loadMore])

  return (
    <div className="mt-4">
      <AlbumList albums={items} />

      <p aria-live="polite" className="sr-only">
        Showing {items.length} of {total} albums.
      </p>

      <div ref={sentinelRef} className="mt-6 flex justify-center">
        {error ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void loadMore()}>
              Try again
            </Button>
          </div>
        ) : isLoading ? (
          <Spinner className="size-5 text-muted-foreground" />
        ) : hasMore ? (
          // Scrolling triggers this automatically; the button keeps it
          // reachable by keyboard and if the observer never fires.
          <Button variant="outline" size="sm" onClick={() => void loadMore()}>
            Load more
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            That&apos;s all {total} {total === 1 ? "album" : "albums"}.
          </p>
        )}
      </div>
    </div>
  )
}
