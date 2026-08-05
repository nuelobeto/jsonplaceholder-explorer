import Link from "next/link"
import {
  BuildingIcon,
  ChevronRightIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SearchXIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UserRow } from "@/features/users/components/user-row"
import type { User } from "@/features/users/schema"
import { getInitials } from "@/features/users/utils"
import { ROUTES } from "@/lib/constants"

/** JSONPlaceholder stores websites bare ("hildegard.org"); links need a scheme. */
const toHref = (website: string) =>
  website.startsWith("http") ? website : `https://${website}`

/**
 * The icon lives inside the <dt> on purpose: a <dl> may only contain <dt>/<dd>
 * pairs (optionally wrapped in a bare <div>), so a loose <svg> sibling would be
 * invalid markup.
 */
const FieldLabel = ({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) => (
  <dt className="shrink-0 text-muted-foreground [&>svg]:size-4">
    {icon}
    <span className="sr-only">{label}</span>
  </dt>
)

const UserAvatar = ({ name }: { name: string }) => (
  <Avatar size="lg" className="shrink-0">
    <AvatarFallback className="bg-linear-to-br from-brand/15 to-brand-accent/15 text-xs font-semibold text-foreground">
      {getInitials(name)}
    </AvatarFallback>
  </Avatar>
)

export const UsersTable = ({
  users,
  query,
}: {
  users: User[]
  query: string
}) => {
  if (users.length === 0) {
    return (
      <Empty className="mt-6 border bg-card/50 py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon />
          </EmptyMedia>
          <EmptyTitle>No users found</EmptyTitle>
          <EmptyDescription>
            Nothing matches <span className="font-medium">“{query}”</span>. Try
            a name, username, email, company, or city.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="mt-6">
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {users.length} {users.length === 1 ? "user" : "users"}
        {query && ` matching “${query}”`}
      </p>

      {/* Mobile: a stack of cards — a five-column table is unreadable at 375px. */}
      <ul className="mt-4 grid gap-3 md:hidden">
        {users.map((user) => (
          <li
            key={user.id}
            className="relative rounded-xl border bg-card p-4 transition-colors focus-within:border-brand/40 hover:border-brand/40"
          >
            <div className="flex items-start gap-3">
              <UserAvatar name={user.name} />
              <div className="min-w-0 flex-1">
                {/* The pseudo-element stretches this link over the whole card. */}
                <Link
                  href={ROUTES.dashboard.user(user.id)}
                  className="truncate font-medium outline-none after:absolute after:inset-0 after:rounded-xl"
                >
                  {user.name}
                </Link>
                <p className="truncate text-sm text-muted-foreground">
                  @{user.username}
                </p>
              </div>
              <Badge variant="outline" className="shrink-0 font-mono">
                #{user.id}
              </Badge>
            </div>

            <dl className="mt-4 grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <FieldLabel icon={<MailIcon />} label="Email" />
                <dd className="relative z-10 min-w-0">
                  <a
                    href={`mailto:${user.email}`}
                    className="block truncate hover:text-brand hover:underline"
                  >
                    {user.email}
                  </a>
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <FieldLabel icon={<PhoneIcon />} label="Phone" />
                <dd className="min-w-0 truncate text-muted-foreground">
                  {user.phone}
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <FieldLabel icon={<BuildingIcon />} label="Company" />
                <dd className="min-w-0 truncate">{user.company.name}</dd>
              </div>
              <div className="flex items-center gap-2">
                <FieldLabel icon={<MapPinIcon />} label="City" />
                <dd className="min-w-0 truncate text-muted-foreground">
                  {user.address.city}, {user.address.zipcode}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      {/* Desktop: the full table. */}
      <div className="mt-4 hidden overflow-hidden rounded-xl border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="px-4">User</TableHead>
              <TableHead className="px-4">Contact</TableHead>
              <TableHead className="px-4">Company</TableHead>
              <TableHead className="px-4">Location</TableHead>
              <TableHead className="px-4">Website</TableHead>
              <TableHead className="w-10 px-4">
                <span className="sr-only">View details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserRow key={user.id} href={ROUTES.dashboard.user(user.id)}>
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.name} />
                    <div className="min-w-0">
                      <Link
                        href={ROUTES.dashboard.user(user.id)}
                        className="font-medium hover:text-brand hover:underline"
                      >
                        {user.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <a
                    href={`mailto:${user.email}`}
                    className="block hover:text-brand hover:underline"
                  >
                    {user.email}
                  </a>
                  <p className="text-xs text-muted-foreground">{user.phone}</p>
                </TableCell>
                <TableCell className="max-w-64 px-4 py-3">
                  <p className="truncate">{user.company.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.company.catchPhrase}
                  </p>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <p>{user.address.city}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.address.zipcode}
                  </p>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <a
                    href={toHref(user.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-brand hover:underline"
                  >
                    {user.website}
                  </a>
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <ChevronRightIcon
                    aria-hidden
                    className="size-4 text-muted-foreground"
                  />
                </TableCell>
              </UserRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
