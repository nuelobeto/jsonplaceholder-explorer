import { Suspense } from "react"
import type { Metadata } from "next"
import {
  CircleCheckIcon,
  FileTextIcon,
  ImageIcon,
  LibraryIcon,
  MessageSquareIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

import { CompletionChart } from "@/components/charts/completion-chart"
import { PaletteHeatmap } from "@/components/charts/palette-heatmap"
import { StatWidget } from "@/components/charts/stat-widget"
import { TitleLengthChart } from "@/components/charts/title-length-chart"
import { TldChart } from "@/components/charts/tld-chart"
import { LatestPostsPanel } from "@/components/dashboard/latest-posts-panel"
import { RecentCommentsPanel } from "@/components/dashboard/recent-comments-panel"
import { TopDomainsPanel } from "@/components/dashboard/top-domains-panel"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getCommentTlds,
  getLatestPosts,
  getPhotoPalette,
  getPostTitleLengths,
  getRecentComments,
  getTodoCompletionByUser,
} from "@/features/analytics/services"
import { ROUTES } from "@/lib/constants"
import { fetchResourceCount } from "@/lib/resource-fetch"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Overview",
  description:
    "Live counts and data visualisations across every JSONPlaceholder resource.",
  path: "/dashboard/overview",
})

type Resource = {
  resource: string
  label: string
  href: string
  icon: LucideIcon
  slot: 1 | 2 | 3 | 4 | 5 | 6
  detail: string
}

const resources: Resource[] = [
  {
    resource: "users",
    label: "Users",
    href: ROUTES.dashboard.users,
    icon: UsersIcon,
    slot: 1,
    detail: "Everything else hangs off these",
  },
  {
    resource: "posts",
    label: "Posts",
    href: ROUTES.dashboard.posts,
    icon: FileTextIcon,
    slot: 2,
    detail: "10 per user, exactly",
  },
  {
    resource: "comments",
    label: "Comments",
    href: ROUTES.dashboard.comments,
    icon: MessageSquareIcon,
    slot: 3,
    detail: "5 on every post",
  },
  {
    resource: "albums",
    label: "Albums",
    href: ROUTES.dashboard.albums,
    icon: LibraryIcon,
    slot: 4,
    detail: "10 per user, exactly",
  },
  {
    resource: "photos",
    label: "Photos",
    href: ROUTES.dashboard.photos,
    icon: ImageIcon,
    slot: 5,
    detail: "50 in every album",
  },
  {
    resource: "todos",
    label: "Todos",
    href: ROUTES.dashboard.todos,
    icon: CircleCheckIcon,
    slot: 6,
    detail: "20 per user, 45% complete",
  },
]

/** All six counts land together so each card can show its share of the whole. */
const StatWidgets = async () => {
  const counts = await Promise.all(
    resources.map((item) => fetchResourceCount(item.resource))
  )
  const total = counts.reduce((sum, count) => sum + count, 0)

  return (
    <>
      {resources.map((item, index) => (
        <StatWidget
          key={item.resource}
          label={item.label}
          value={counts[index]}
          detail={item.detail}
          share={counts[index] / total}
          href={item.href}
          slot={item.slot}
          icon={<item.icon />}
        />
      ))}
    </>
  )
}

const TotalRecords = async () => {
  const counts = await Promise.all(
    resources.map((item) => fetchResourceCount(item.resource))
  )

  return (
    <span className="text-4xl font-semibold tracking-tight sm:text-5xl">
      {counts.reduce((sum, count) => sum + count, 0).toLocaleString()}
    </span>
  )
}

const WidgetSkeleton = () => (
  <div className="rounded-2xl border p-5">
    <Skeleton className="size-11 rounded-xl" />
    <Skeleton className="mt-4 h-4 w-20" />
    <Skeleton className="mt-2 h-8 w-24" />
    <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
  </div>
)

const PanelSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <Card aria-hidden className="rounded-2xl shadow-sm">
    <CardHeader className="gap-2">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-4 w-52" />
    </CardHeader>
    <CardContent className="space-y-3">
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-9 w-full" />
      ))}
    </CardContent>
  </Card>
)

const CompletionSection = async () => (
  <CompletionChart rows={await getTodoCompletionByUser()} />
)
const TldSection = async () => <TldChart rows={await getCommentTlds()} />
const TitleLengthSection = async () => (
  <TitleLengthChart buckets={await getPostTitleLengths()} />
)
const PaletteSection = async () => (
  <PaletteHeatmap grid={await getPhotoPalette()} />
)
const LatestPostsSection = async () => (
  <LatestPostsPanel posts={await getLatestPosts(5)} />
)
const RecentCommentsSection = async () => (
  <RecentCommentsPanel comments={await getRecentComments(5)} />
)
const TopDomainsSection = async () => (
  <TopDomainsPanel rows={await getCommentTlds()} />
)

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back 👋
          </h1>
          <p className="mt-2 max-w-prose text-sm text-muted-foreground">
            Six resources, counted and charted live from the API.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Records in the API</p>
          <Suspense fallback={<Skeleton className="mt-1 h-11 w-36" />}>
            <TotalRecords />
          </Suspense>
        </div>
      </header>

      <section className="mt-8" aria-labelledby="totals-heading">
        <h2 id="totals-heading" className="sr-only">
          Record totals by resource
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Suspense
            fallback={Array.from({ length: 6 }, (_, index) => (
              <WidgetSkeleton key={index} />
            ))}
          >
            <StatWidgets />
          </Suspense>
        </div>
      </section>

      <section className="mt-6" aria-labelledby="charts-heading">
        <h2 id="charts-heading" className="sr-only">
          Data visualisations
        </h2>

        {/* grid-cols-1 is load-bearing: a bare `grid` sizes its single track to
            min-content, which let the heatmap push every card off-screen. */}
        {/* Paired by height: grid rows are as tall as their tallest card, so
            putting the two tall charts together and the two short ones together
            cuts the dead space a mismatched pairing leaves behind. */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <Suspense fallback={<PanelSkeleton rows={10} />}>
            <CompletionSection />
          </Suspense>
          <Suspense fallback={<PanelSkeleton rows={7} />}>
            <PaletteSection />
          </Suspense>
          <Suspense fallback={<PanelSkeleton rows={12} />}>
            <TldSection />
          </Suspense>
          <Suspense fallback={<PanelSkeleton rows={5} />}>
            <TitleLengthSection />
          </Suspense>
        </div>
      </section>

      <section className="mt-6" aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="sr-only">
          Recent activity
        </h2>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <Suspense fallback={<PanelSkeleton />}>
            <LatestPostsSection />
          </Suspense>
          <Suspense fallback={<PanelSkeleton />}>
            <RecentCommentsSection />
          </Suspense>
          <Suspense fallback={<PanelSkeleton rows={2} />}>
            <TopDomainsSection />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
