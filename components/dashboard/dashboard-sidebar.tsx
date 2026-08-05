"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DASHBOARD_NAV_LINKS } from "@/lib/constants"

/**
 * Nested routes light up their section, so /dashboard/users/4 keeps "Users"
 * highlighted. The trailing slash stops /dashboard/user matching /dashboard/users.
 */
const isActiveRoute = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

export const DashboardSidebar = () => {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 flex-row items-center border-b">
        <Link href="/" className="group flex items-center gap-2 font-semibold">
          <span
            aria-hidden
            className="size-2.5 rounded-full bg-linear-to-br from-brand to-brand-accent transition-transform duration-300 group-hover:scale-125"
          />
          JSONPlaceholder Explorer
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col py-2">
            <SidebarMenu className="gap-1">
              {DASHBOARD_NAV_LINKS.map((link) => {
                const isActive = isActiveRoute(pathname, link.href)

                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      tooltip={link.label}
                      isActive={isActive}
                      aria-current={isActive ? "page" : undefined}
                      render={<Link href={link.href} />}
                    >
                      <link.icon />
                      <span>{link.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
