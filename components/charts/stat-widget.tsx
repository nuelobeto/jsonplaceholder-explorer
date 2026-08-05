import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

/**
 * The pastel stat card.
 *
 * The reference design puts a trend sparkline and a "+2.6% than last year"
 * delta in each card. JSONPlaceholder has no timestamps anywhere, so both would
 * be invented — the slot instead carries this resource's real share of all
 * records, which is a fact the data can actually support.
 */
export const StatWidget = ({
  label,
  value,
  detail,
  share,
  href,
  slot,
  icon,
}: {
  label: string
  value: number
  detail: string
  share: number
  href: string
  slot: 1 | 2 | 3 | 4 | 5 | 6
  icon: ReactNode
}) => (
  <Link
    href={href}
    className="group relative flex flex-col overflow-hidden rounded-2xl p-5 transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    style={{
      background: `var(--viz-tint-${slot})`,
      color: "var(--viz-tint-ink)",
    }}
  >
    <div className="flex items-start justify-between gap-3">
      <span
        aria-hidden
        className="flex size-11 items-center justify-center rounded-xl [&>svg]:size-5"
        style={{ background: `var(--viz-${slot})`, color: "#fff" }}
      >
        {icon}
      </span>
      <ArrowRightIcon
        aria-hidden
        className="size-4 opacity-40 transition-transform group-hover:translate-x-0.5"
      />
    </div>

    <p className="mt-4 text-sm" style={{ color: "var(--viz-tint-muted)" }}>
      {label}
    </p>
    <p className="mt-0.5 text-3xl font-semibold tracking-tight">
      {value.toLocaleString()}
    </p>

    <p className="mt-1 text-xs" style={{ color: "var(--viz-tint-muted)" }}>
      {detail}
    </p>

    {/* Share of all 5,910 records — a real proportion, not a fabricated trend. */}
    <div className="mt-4">
      <div
        className="h-1.5 overflow-hidden rounded-full"
        style={{
          background:
            "color-mix(in srgb, var(--viz-tint-ink) 12%, transparent)",
        }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.max(share * 100, 1.5)}%`,
            background: `var(--viz-${slot})`,
          }}
        />
      </div>
      <p className="mt-1.5 text-xs" style={{ color: "var(--viz-tint-muted)" }}>
        {(share * 100).toFixed(share < 0.01 ? 2 : 1)}% of all records
      </p>
    </div>
  </Link>
)
