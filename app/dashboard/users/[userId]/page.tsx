import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  CircleCheckIcon,
  FileTextIcon,
  GlobeIcon,
  LibraryIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlbumList } from "@/features/albums/components/album-list"
import { getAlbumsByUser } from "@/features/albums/services"
import { PostList } from "@/features/posts/components/post-list"
import { getPostsByUser } from "@/features/posts/services"
import { TodoList } from "@/features/todos/components/todo-list"
import { getTodosByUser } from "@/features/todos/services"
import { UserMap } from "@/features/users/components/user-map"
import { UserResourceCard } from "@/features/users/components/user-resource-card"
import { ResourceCardSkeleton } from "@/features/users/components/resource-card-skeleton"
import { getUser } from "@/features/users/services"
import { getInitials, parseUserId } from "@/features/users/utils"
import { ROUTES } from "@/lib/constants"
import { buildMetadata } from "@/lib/seo"
import { cn } from "@/lib/utils"

type PageProps = { params: Promise<{ userId: string }> }

/** How many of each resource the detail page previews before "View more". */
const PREVIEW_COUNT = 10

const toHref = (website: string) =>
  website.startsWith("http") ? website : `https://${website}`

/**
 * Each section fetches on its own so a slow resource streams in late instead of
 * holding up the whole page. The user has already resolved by the time these
 * render, so `notFound()` has set its status before any of this streams.
 */
const PostsSection = async ({ userId }: { userId: number }) => {
  const posts = await getPostsByUser(userId)

  return (
    <UserResourceCard
      title="Posts"
      icon={<FileTextIcon />}
      total={posts.length}
      viewMoreHref={ROUTES.dashboard.userPosts(userId)}
      emptyMessage="This user hasn't posted anything."
    >
      <PostList posts={posts.slice(0, PREVIEW_COUNT)} />
    </UserResourceCard>
  )
}

const AlbumsSection = async ({ userId }: { userId: number }) => {
  const albums = await getAlbumsByUser(userId)

  return (
    <UserResourceCard
      title="Albums"
      icon={<LibraryIcon />}
      total={albums.length}
      viewMoreHref={ROUTES.dashboard.userAlbums(userId)}
      emptyMessage="This user has no albums."
    >
      <AlbumList albums={albums.slice(0, PREVIEW_COUNT)} />
    </UserResourceCard>
  )
}

const TodosSection = async ({ userId }: { userId: number }) => {
  const todos = await getTodosByUser(userId)

  return (
    <UserResourceCard
      title="Todos"
      icon={<CircleCheckIcon />}
      total={todos.length}
      viewMoreHref={ROUTES.dashboard.userTodos(userId)}
      emptyMessage="This user has no todos."
    >
      <TodoList todos={todos.slice(0, PREVIEW_COUNT)} />
    </UserResourceCard>
  )
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { userId } = await params
  const id = parseUserId(userId)
  const user = id === null ? null : await getUser(id)

  if (!user) return { title: "User not found", robots: { index: false } }

  return buildMetadata({
    title: user.name,
    description: `${user.name} (@${user.username}) — ${user.company.name}, ${user.address.city}.`,
    path: ROUTES.dashboard.user(user.id),
    // This segment ships its own generated card naming the user.
    image: `${ROUTES.dashboard.user(user.id)}/opengraph-image`,
  })
}

export default async function Page({ params }: PageProps) {
  const { userId } = await params
  const id = parseUserId(userId)
  const user = id === null ? null : await getUser(id)

  if (!user) notFound()

  const lat = Number(user.address.geo.lat)
  const lng = Number(user.address.geo.lng)
  const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lng)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <Link
        href={ROUTES.dashboard.users}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        All users
      </Link>

      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar className="size-16 shrink-0">
          <AvatarFallback className="bg-linear-to-br from-brand/20 to-brand-accent/20 text-lg font-semibold text-foreground">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {user.name}
            </h1>
            <Badge variant="outline" className="font-mono">
              #{user.id}
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">@{user.username}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={`mailto:${user.email}`}
            className={cn(buttonVariants({ size: "sm" }), "gap-2")}
          >
            <MailIcon />
            Email
          </a>
          <a
            href={toHref(user.website)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "gap-2"
            )}
          >
            <GlobeIcon />
            Website
          </a>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="grid gap-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailRow icon={<MailIcon />} label="Email">
                  <a
                    href={`mailto:${user.email}`}
                    className="break-all hover:text-brand hover:underline"
                  >
                    {user.email}
                  </a>
                </DetailRow>
                <DetailRow icon={<PhoneIcon />} label="Phone">
                  <a
                    href={`tel:${user.phone.split(" x")[0]}`}
                    className="hover:text-brand hover:underline"
                  >
                    {user.phone}
                  </a>
                </DetailRow>
                <DetailRow icon={<GlobeIcon />} label="Website">
                  <a
                    href={toHref(user.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all hover:text-brand hover:underline"
                  >
                    {user.website}
                  </a>
                </DetailRow>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company</CardTitle>
              <CardDescription>{user.company.catchPhrase}</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4">
                <DetailRow icon={<BriefcaseIcon />} label="Name">
                  {user.company.name}
                </DetailRow>
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                {user.company.bs.split(" ").map((term) => (
                  <Badge key={term} variant="secondary">
                    {term}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>
              {user.address.suite}, {user.address.street}
              <br />
              {user.address.city} {user.address.zipcode}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            {hasCoordinates ? (
              <>
                <div className="h-64 w-full border-y sm:h-80">
                  <UserMap lat={lat} lng={lng} label={user.name} />
                </div>
                <div className="px-(--card-spacing) pt-(--card-spacing) text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <MapPinIcon className="size-3.5 shrink-0" />
                    <span className="font-mono">
                      {lat.toFixed(4)}, {lng.toFixed(4)}
                    </span>
                  </p>
                  <p className="mt-2 text-pretty">
                    JSONPlaceholder generates its coordinates at random, so the
                    pin won&apos;t match {user.address.city}.
                  </p>
                </div>
              </>
            ) : (
              <p className="px-(--card-spacing) text-sm text-muted-foreground">
                This user has no usable coordinates.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6">
        <Suspense fallback={<ResourceCardSkeleton rows={PREVIEW_COUNT} />}>
          <PostsSection userId={user.id} />
        </Suspense>
        <Suspense fallback={<ResourceCardSkeleton rows={PREVIEW_COUNT / 2} />}>
          <AlbumsSection userId={user.id} />
        </Suspense>
        <Suspense fallback={<ResourceCardSkeleton rows={PREVIEW_COUNT} />}>
          <TodosSection userId={user.id} />
        </Suspense>
      </div>
    </div>
  )
}

const DetailRow = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) => (
  <div className="relative min-w-0 pl-11">
    <dt className="text-xs text-muted-foreground">
      {/* Absolutely placed: a <dl> may only contain <dt>/<dd> (optionally
          wrapped in a bare <div>), so the icon has to live inside one of them. */}
      <span
        aria-hidden
        className="absolute top-0 left-0 flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground [&>svg]:size-4"
      >
        {icon}
      </span>
      {label}
    </dt>
    <dd className="mt-0.5 min-w-0 text-sm">{children}</dd>
  </div>
)
