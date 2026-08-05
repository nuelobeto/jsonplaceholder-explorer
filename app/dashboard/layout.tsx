import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar"
import { SidebarProvider } from "@/components/ui/sidebar"

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
