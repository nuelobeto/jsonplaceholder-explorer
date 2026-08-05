"use client"

import { useState } from "react"
import { ImageOffIcon } from "lucide-react"

import type { Photo } from "@/features/photos/schemas"

/**
 * JSONPlaceholder's image host (via.placeholder.com) was retired, so these URLs
 * no longer load. The last path segment is a hex colour ("…/150/92c952"), which
 * we can still render — the grid stays meaningful instead of showing 50 broken
 * images. If the host ever comes back, the real thumbnail wins.
 */
const swatchFromUrl = (url: string): string | null => {
  const segment = url.split("/").pop() ?? ""
  if (!/^[0-9a-f]{1,6}$/i.test(segment)) return null

  // 302 of the 5,000 photos carry a short segment ("abef8", "d34"): the source
  // data hex-encoded the colour without zero-padding it. Padding restores the
  // value rather than treating "abc" as CSS shorthand, which would be a
  // different colour entirely.
  return `#${segment.padStart(6, "0")}`
}

export const PhotoTile = ({ photo }: { photo: Photo }) => {
  const [failed, setFailed] = useState(false)
  const swatch = swatchFromUrl(photo.thumbnailUrl)

  return (
    <figure className="overflow-hidden rounded-lg border bg-card">
      <div
        className="flex aspect-square items-center justify-center bg-muted"
        style={failed && swatch ? { backgroundColor: swatch } : undefined}
      >
        {failed ? (
          !swatch && (
            <ImageOffIcon
              aria-hidden
              className="size-5 text-muted-foreground"
            />
          )
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element -- the remote host
             is dead, so there is nothing for next/image to optimise. */
          <img
            src={photo.thumbnailUrl}
            alt={photo.title}
            loading="lazy"
            decoding="async"
            width={150}
            height={150}
            onError={() => setFailed(true)}
            className="size-full object-cover"
          />
        )}
      </div>
      <figcaption className="p-2 text-xs text-pretty text-muted-foreground first-letter:uppercase">
        {photo.title}
      </figcaption>
    </figure>
  )
}
