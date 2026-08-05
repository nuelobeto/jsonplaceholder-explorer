import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import type { User } from "@/features/users/schemas"
import { ROUTES } from "@/lib/constants"

/** Common chrome for the per-user resource pages: back link, title, blurb. */
export const UserResourceShell = ({
  user,
  title,
  description,
  children,
}: {
  user: User
  title: string
  description: string
  children: ReactNode
}) => (
  <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
    <Link
      href={ROUTES.dashboard.user(user.id)}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeftIcon className="size-4" />
      {user.name}
    </Link>

    <header className="mt-6">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 max-w-prose text-sm text-muted-foreground">
        {description}
      </p>
    </header>

    {children}
  </div>
)
