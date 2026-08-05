import type { Metadata } from "next"
import { Footer } from "@/components/landing/footer"
import { Hero } from "@/components/landing/hero"
import { Header } from "@/components/landing/header"
import { Features } from "@/components/landing/features"
import { Resources } from "@/components/landing/resources"
import { About } from "@/components/landing/about"
import { siteConfig } from "@/lib/site"

/**
 * The root layout's title template appends the site name, so a `title` here
 * would double it up ("… · JSONPlaceholder Explorer · JSONPlaceholder
 * Explorer"). Omitting it lets the layout's default stand.
 */
export const metadata: Metadata = {
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
}

/**
 * Structured data. WebSite lets search engines show a name for the site;
 * SoftwareApplication describes what this actually is. Injected as a raw script
 * tag because JSON-LD must not be HTML-escaped.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: "en-US",
      publisher: { "@id": `${siteConfig.url}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    {
      "@type": "SoftwareApplication",
      name: siteConfig.name,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      description: siteConfig.description,
      url: siteConfig.url,
      author: { "@id": `${siteConfig.url}/#person` },
      codeRepository: siteConfig.repository,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // Serialised from a literal we control — no user input reaches it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
