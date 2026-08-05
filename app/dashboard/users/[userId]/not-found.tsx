import Link from "next/link"
import { UserXIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ROUTES } from "@/lib/constants"

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <Empty className="border bg-card/50 py-20">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UserXIcon />
          </EmptyMedia>
          <EmptyTitle>User not found</EmptyTitle>
          <EmptyDescription>
            JSONPlaceholder only has ten users, with ids 1 through 10.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            href={ROUTES.dashboard.users}
            className={buttonVariants({ size: "sm" })}
          >
            Back to all users
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  )
}
