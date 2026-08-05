"use client"

import { useEffect, useState } from "react"

type LazyList<T> = { items: T[]; isLoading: boolean; error: boolean }

type Settled<T> = { id: number | null; items: T[]; error: boolean }

/**
 * Loads a list the first time an id appears, and reloads when it changes.
 * A response for a superseded id is discarded, so opening one sheet and
 * quickly switching to another can't paint the first one's results.
 *
 * Only the settled result is stored — "loading" is derived from the stored id
 * not yet matching the requested one, which keeps state out of the effect body.
 *
 * `load` must be a stable reference; a module-scope server action is.
 */
export const useLazyList = <T>(
  id: number | null,
  load: (id: number) => Promise<T[]>
): LazyList<T> => {
  const [settled, setSettled] = useState<Settled<T>>({
    id: null,
    items: [],
    error: false,
  })

  useEffect(() => {
    if (id === null) return

    let active = true

    load(id)
      .then((items) => {
        if (active) setSettled({ id, items, error: false })
      })
      .catch(() => {
        if (active) setSettled({ id, items: [], error: true })
      })

    return () => {
      active = false
    }
  }, [id, load])

  const isCurrent = settled.id === id

  return {
    items: isCurrent ? settled.items : [],
    isLoading: id !== null && !isCurrent,
    error: isCurrent && settled.error,
  }
}
