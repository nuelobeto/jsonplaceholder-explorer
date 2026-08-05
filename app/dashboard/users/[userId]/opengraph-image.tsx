import { ImageResponse } from "next/og"

import { getUser } from "@/features/users/services"
import { getInitials, parseUserId } from "@/features/users/utils"
import { ogBrand, siteConfig } from "@/lib/site"

export const alt = "User profile"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * Per-user social card. These pages are noindex (see the dashboard layout), but
 * OG images are still fetched when someone pastes the link into Slack, Discord
 * or a DM — robots directives don't govern unfurling.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const id = parseUserId(userId)
  const user = id === null ? null : await getUser(id)

  const heading = user?.name ?? "User not found"
  const subheading = user
    ? `@${user.username} · ${user.company.name}`
    : "This user does not exist in the API"

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
      <div
        style={{
          position: "absolute",
          top: -280,
          right: -160,
          width: 760,
          height: 760,
          borderRadius: 999,
          background: `radial-gradient(circle, ${ogBrand.brand}5e 0%, transparent 70%)`,
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
            fontSize: 26,
            color: ogBrand.muted,
            fontWeight: 600,
            display: "flex",
          }}
        >
          {siteConfig.name}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        {user && (
          <div
            style={{
              width: 168,
              height: 168,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${ogBrand.brand}2e, ${ogBrand.accent}2e)`,
              border: `2px solid ${ogBrand.brand}55`,
              fontSize: 62,
              fontWeight: 700,
              color: ogBrand.foreground,
            }}
          >
            {getInitials(user.name)}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: ogBrand.foreground,
              letterSpacing: -2,
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            {heading}
          </div>
          <div style={{ fontSize: 32, color: ogBrand.muted, display: "flex" }}>
            {subheading}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 14 }}>
        {["Posts", "Albums", "Todos", "Location"].map((section) => (
          <div
            key={section}
            style={{
              display: "flex",
              fontSize: 22,
              color: ogBrand.muted,
              border: `1px solid ${ogBrand.muted}40`,
              borderRadius: 999,
              padding: "10px 22px",
            }}
          >
            {section}
          </div>
        ))}
      </div>
    </div>,
    size
  )
}
