import { ImageResponse } from "next/og"

import { ogBrand, siteConfig } from "@/lib/site"

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * Social card for the site root.
 *
 * Satori (which renders this) supports a subset of CSS: no oklch, no CSS
 * variables, no external stylesheets, and flexbox only — every element needs an
 * explicit `display`. Hence the inline hexes from lib/site.ts.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: ogBrand.background,
        padding: 80,
        fontFamily: "sans-serif",
      }}
    >
      {/* Ambient wash, echoing the landing page's gradient. */}
      <div
        style={{
          position: "absolute",
          top: -260,
          left: -160,
          width: 780,
          height: 780,
          borderRadius: 999,
          background: `radial-gradient(circle, ${ogBrand.brand}66 0%, transparent 70%)`,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -300,
          right: -180,
          width: 720,
          height: 720,
          borderRadius: 999,
          background: `radial-gradient(circle, ${ogBrand.accent}55 0%, transparent 70%)`,
          display: "flex",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${ogBrand.brand}, ${ogBrand.accent})`,
            display: "flex",
          }}
        />
        <div
          style={{
            fontSize: 28,
            color: ogBrand.foreground,
            fontWeight: 600,
            display: "flex",
          }}
        >
          {siteConfig.name}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 82,
            lineHeight: 1.05,
            fontWeight: 700,
            color: ogBrand.foreground,
            letterSpacing: -2,
            maxWidth: 900,
            display: "flex",
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            fontSize: 30,
            color: ogBrand.muted,
            maxWidth: 860,
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          5,910 records across six resources — searchable, charted, and fully
          keyboard accessible.
        </div>
      </div>

      <div style={{ display: "flex", gap: 14 }}>
        {["Next.js", "TypeScript", "Tailwind CSS", "Server Components"].map(
          (tech) => (
            <div
              key={tech}
              style={{
                display: "flex",
                fontSize: 22,
                color: ogBrand.muted,
                border: `1px solid ${ogBrand.muted}40`,
                borderRadius: 999,
                padding: "10px 22px",
              }}
            >
              {tech}
            </div>
          )
        )}
      </div>
    </div>,
    size
  )
}
