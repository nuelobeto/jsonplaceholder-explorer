"use server"

import type { Photo } from "./schemas"
import { getPhotosByAlbum } from "./services"

/** Fetched when the sheet opens — 50 photos is too much to preload per album. */
export const loadAlbumPhotos = async (albumId: number): Promise<Photo[]> => {
  if (!Number.isInteger(albumId) || albumId < 1) {
    throw new Error(`Invalid album id: ${albumId}`)
  }
  return getPhotosByAlbum(albumId)
}
