import type { MetadataRoute } from "next"

import { siteConfig } from "@/lib/site"

/**
 * Only the landing page is listed. Every dashboard route is noindex, and a
 * sitemap that advertises noindex URLs is a contradictory signal — Search
 * Console reports it as "Submitted URL marked noindex".
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
