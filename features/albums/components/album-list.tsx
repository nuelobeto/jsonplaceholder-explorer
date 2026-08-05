"use client"

import { useState } from "react"
import { LibraryIcon } from "lucide-react"

import type { Album } from "@/features/albums/schemas"
import { AlbumPhotosSheet } from "@/features/photos/components/album-photos-sheet"

/** Shared by the detail-page preview and the infinite-scroll page. */
export const AlbumList = ({ albums }: { albums: Album[] }) => {
  const [selected, setSelected] = useState<Album | null>(null)

  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-2">
        {albums.map((album) => (
          <li key={album.id}>
            <button
              type="button"
              onClick={() => setSelected(album)}
              className="flex w-full items-start gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:border-brand/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-brand/15 to-brand-accent/15 text-muted-foreground [&>svg]:size-4"
              >
                <LibraryIcon />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-pretty first-letter:uppercase">
                  {album.title}
                </span>
                <span className="mt-0.5 block font-mono text-xs text-muted-foreground">
                  #{album.id}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <AlbumPhotosSheet album={selected} onClose={() => setSelected(null)} />
    </>
  )
}
