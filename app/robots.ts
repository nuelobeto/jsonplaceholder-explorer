import type { MetadataRoute } from "next"

import { siteConfig } from "@/lib/site"

/**
 * The landing page is the content worth ranking. The dashboard is an app UI
 * over someone else's fixture data — 250 pages of lorem-ipsum photos and 5,000
 * near-identical records — so it is crawlable for link discovery but excluded
 * from the index (the dashboard layout sets the matching noindex header).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
