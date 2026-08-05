import type { Metadata } from "next"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar"
import { SidebarProvider } from "@/components/ui/sidebar"

/**
 * Inherited by every dashboard route.
 *
 * The content here is JSONPlaceholder's lorem-ipsum fixture data, paginated to
 * 250 pages of photos alone — indexing it would bury the landing page under
 * thousands of near-duplicate URLs. `follow` stays on so link equity still
 * flows. Delete this export to let the dashboard into the index (and drop the
 * matching Disallow in app/robots.ts).
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className="relative w-full min-w-0">
        <DashboardTopbar />
        <main>{children}</main>
      </div>
    </SidebarProvider>
  )
}
