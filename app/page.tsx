import type { Metadata } from "next"
import { Footer } from "@/components/landing/footer"
import { Hero } from "@/components/landing/hero"
import { Header } from "@/components/landing/header"
import { Features } from "@/components/landing/features"
import { Resources } from "@/components/landing/resources"
import { About } from "@/components/landing/about"

export const metadata: Metadata = {
  title: "JSONPlaceholder Explorer",
  description: "Explore JSONPlaceholder resources.",
}

export default function Page() {
  return (
    <>
      <a
        href="#features"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>
      <Header />
      {/* No top padding: the header is transparent until scrolled, so the
          hero's grid and aurora run underneath it. */}
      <main>
        <Hero />
        <Features />
        <Resources />
        <About />
      </main>
      <Footer />
    </>
  )
}
