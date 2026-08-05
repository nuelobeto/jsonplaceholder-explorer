"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, useMotionValueEvent, useScroll } from "motion/react"
import { Container } from "../container"
import { Button, buttonVariants } from "../ui/button"
import { cn } from "@/lib/utils"
import { LANDING_NAV_LINKS, ROUTES } from "@/lib/constants"
import { MenuIcon, MoonIcon, SunIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

export const Header = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const { scrollY, scrollYProgress } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark")

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 12)
  })

  // Highlight whichever section currently owns the middle of the viewport.
  useEffect(() => {
    const sections = LANDING_NAV_LINKS.map(({ href }) =>
      document.getElementById(href.slice(1))
    ).filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActive(`#${visible.target.id}`)
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" />}
              className="md:hidden"
            >
              <MenuIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[180px]">
              <DropdownMenuGroup>
                {LANDING_NAV_LINKS.map((link) => (
                  <DropdownMenuItem key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active === link.href ? "true" : undefined}
                      className={cn(
                        "flex w-full items-center transition-colors",
                        active === link.href
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={toggleTheme}>
                  Toggle Theme
                </DropdownMenuItem>
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/"
            className="group flex items-center gap-2 font-semibold"
          >
            <span
              aria-hidden
              className="size-2.5 rounded-full bg-linear-to-br from-brand to-brand-accent transition-transform duration-300 group-hover:scale-125"
            />
            JSONPlaceholder Explorer
          </Link>
        </div>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm">
            {LANDING_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active === link.href ? "true" : undefined}
                  className={cn(
                    "relative block rounded-md px-3 py-1.5 transition-colors",
                    active === link.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {active === link.href ? (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-md bg-muted"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  ) : null}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button size="icon" variant="ghost" onClick={toggleTheme}>
            <SunIcon className="hidden dark:block" />
            <MoonIcon className="block dark:hidden" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Link
            href={ROUTES.dashboard.overview}
            className={buttonVariants({ size: "lg" })}
          >
            Dashboard
          </Link>
        </div>
      </Container>

      {/* Reading progress. */}
      <motion.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="h-px origin-left bg-linear-to-r from-brand to-brand-accent"
      />
    </header>
  )
}
