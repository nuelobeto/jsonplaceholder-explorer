import type { Metadata } from "next"

/**
 * Per-page metadata.
 *
 * Two Next.js behaviours make this worth centralising:
 *
 *  - `title` does NOT populate `og:title`. A page that sets only `title`
 *    inherits the root layout's `openGraph.title`, so every share preview reads
 *    the site name. `openGraph.title` has to be set explicitly; the root's
 *    template then appends the site name to it.
 *  - `openGraph.url` is inherited too, so without an override every page
 *    reports the homepage as its canonical OG URL.
 *
 *  - Defining `openGraph` at all REPLACES the parent's, which silently drops
 *    the inherited file-based opengraph-image. So the image is named
 *    explicitly here rather than left to the file convention.
 *
 * `path` and `image` are root-relative; metadataBase makes them absolute.
 * Pass `image` only for a segment that ships its own opengraph-image file.
 */
export const buildMetadata = ({
  title,
  description,
  path,
  image = "/opengraph-image",
}: {
  title: string
  description: string
  path: string
  image?: string
}): Metadata => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: path,
    images: [{ url: image, width: 1200, height: 630, alt: title }],
  },
  twitter: { title, description, images: [image] },
})
