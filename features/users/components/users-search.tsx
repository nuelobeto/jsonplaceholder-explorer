"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { SearchIcon, XIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"

const DEBOUNCE_MS = 250

/**
 * Keeps the text box and the `?q=` search param in sync. The URL stays the
 * source of truth so a search is linkable and survives a refresh.
 */
export const UsersSearch = ({ query }: { query: string }) => {
  const router = useRouter()
  const pathname = usePathname()
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(query)
  const [isPending, startTransition] = useTransition()

  // Adopt URL-driven changes (back/forward, a shared link) — but never yank the
  // text out from under someone who is mid-keystroke.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) setValue(query)
  }, [query])

  useEffect(() => {
    if (value === query) return

    const timer = setTimeout(() => {
      const trimmed = value.trim()
      const href = trimmed
        ? `${pathname}?q=${encodeURIComponent(trimmed)}`
        : pathname
      startTransition(() => router.replace(href, { scroll: false }))
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [value, query, pathname, router])

  const clear = () => {
    setValue("")
    inputRef.current?.focus()
  }

  return (
    <form role="search" onSubmit={(event) => event.preventDefault()}>
      <InputGroup className="h-11 max-w-md rounded-xl bg-card shadow-xs transition-colors focus-within:border-brand/50">
        <InputGroupAddon>
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput
          ref={inputRef}
          type="search"
          name="q"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search by name, email, company…"
          aria-label="Search users"
          className="[&::-webkit-search-cancel-button]:appearance-none"
        />
        <InputGroupAddon align="inline-end">
          {isPending ? (
            <Spinner className="text-muted-foreground" />
          ) : (
            value && (
              <InputGroupButton
                size="icon-xs"
                onClick={clear}
                aria-label="Clear search"
              >
                <XIcon />
              </InputGroupButton>
            )
          )}
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
