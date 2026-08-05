"use client"

import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"
import Link from "next/link"
import { SidebarTrigger } from "../ui/sidebar"
import { Button, buttonVariants } from "../ui/button"

export const DashboardTopbar = () => {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark")

  return (
    <header className="sticky top-0 left-0 z-50 flex h-14 w-full items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>

      <div className="hidden items-center gap-4 md:flex">
        <Button size="icon" variant="ghost" onClick={toggleTheme}>
          <SunIcon className="hidden dark:block" />
          <MoonIcon className="block dark:hidden" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          Home
        </Link>
      </div>
    </header>
  )
}
