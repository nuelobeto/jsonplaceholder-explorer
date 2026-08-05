"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import type { Album } from "@/features/albums/schemas"
import { loadAlbumPhotos } from "@/features/photos/actions"
import { PhotoTile } from "@/features/photos/components/photo-tile"
import { useLazyList } from "@/hooks/use-lazy-list"

const SKELETON_TILES = 9

export const AlbumPhotosSheet = ({
  album,
  onClose,
}: {
  album: Album | null
  onClose: () => void
}) => {
  const { items, isLoading, error } = useLazyList(
    album?.id ?? null,
    loadAlbumPhotos
  )

  return (
    <Sheet
      open={album !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <SheetContent className="w-full data-[side=right]:sm:max-w-xl">
        <SheetHeader className="border-b pr-12">
          <SheetTitle className="text-pretty first-letter:uppercase">
            {album?.title}
          </SheetTitle>
          <SheetDescription>
            {isLoading
              ? "Loading photos…"
              : error
                ? "Photos unavailable"
                : `${items.length} ${items.length === 1 ? "photo" : "photos"} in album #${album?.id}`}
          </SheetDescription>
        </SheetHeader>

        {/*
          min-h-0 lets this shrink inside the flex column so it can scroll, and
          tabIndex makes that scrolling reachable without a mouse.
        */}
        <div
          role="region"
          aria-label="Photos"
          tabIndex={0}
          className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {error ? (
            <p className="text-sm text-destructive">
              Couldn&apos;t load the photos for this album.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {isLoading
                ? Array.from({ length: SKELETON_TILES }, (_, index) => (
                    <Skeleton
                      key={index}
                      className="aspect-square rounded-lg"
                    />
                  ))
                : items.map((photo) => (
                    <PhotoTile key={photo.id} photo={photo} />
                  ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
