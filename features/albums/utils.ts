import { filterByQuery } from "@/lib/search"
import type { Album } from "./schemas"

export const filterAlbums = (albums: Album[], query: string) =>
  filterByQuery(albums, query, (album) => [album.id, album.title])
