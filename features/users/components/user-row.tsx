"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"

import { TableRow } from "@/components/ui/table"

/**
 * Makes the whole row a click target. The user's name inside is still a real
 * `<Link>` — that's what carries keyboard focus, screen-reader semantics, and
 * middle-click; this only adds the mouse affordance on top.
 */
export const UserRow = ({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) => {
  const router = useRouter()

  return (
    <TableRow
      className="cursor-pointer"
      onMouseEnter={() => router.prefetch(href)}
      onClick={(event) => {
        // Links and buttons in the row handle themselves.
        if ((event.target as HTMLElement).closest("a, button")) return
        // Don't hijack a click that was really the end of a text selection.
        if (window.getSelection()?.toString()) return
        router.push(href)
      }}
    >
      {children}
    </TableRow>
  )
}
