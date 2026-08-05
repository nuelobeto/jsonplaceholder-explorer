// components/landing/footer.tsx
import Link from "next/link"
import { Container } from "@/components/container"

const columns = [
  {
    heading: "Explore",
    links: [
      { href: "#features", label: "Features" },
      { href: "#resources", label: "Resources" },
      { href: "#about", label: "About" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    heading: "Reference",
    links: [
      {
        href: "https://jsonplaceholder.typicode.com",
        label: "JSONPlaceholder",
        external: true,
      },
      {
        href: "https://github.com/nuelobeto/jsonplaceholder-explorer",
        label: "Source on GitHub",
        external: true,
      },
      { href: "https://nextjs.org", label: "Next.js", external: true },
    ],
  },
]

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t bg-muted/30">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand/50 to-transparent"
      />

      <Container className="py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
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
            <p className="mt-3 text-sm text-pretty text-muted-foreground">
              A typed, accessible front end for the free fake API that everyone
              prototypes against.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            {columns.map((column) => (
              <nav key={column.heading} aria-labelledby={`footer-${column.heading}`}>
                <h2
                  id={`footer-${column.heading}`}
                  className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground"
                >
                  {column.heading}
                </h2>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        {...("external" in link && link.external
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} JSONPlaceholder Explorer. A demo
            project.
          </p>
          <p>
            Data from{" "}
            <a
              href="https://jsonplaceholder.typicode.com"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 transition-colors hover:text-foreground"
            >
              jsonplaceholder.typicode.com
            </a>
          </p>
        </div>
      </Container>
    </footer>
  )
}
