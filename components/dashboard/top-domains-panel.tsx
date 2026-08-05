import { PanelCard } from "@/components/dashboard/panel-card"
import type { TldRow } from "@/features/analytics/services"
import { ROUTES } from "@/lib/constants"

/** Tile grid, in the shape of the reference design's "traffic by site" panel. */
export const TopDomainsPanel = ({ rows }: { rows: TldRow[] }) => {
  const top = rows.slice(0, 4)

  return (
    <PanelCard
      title="Top comment domains"
      description="Where the 500 commenters say they are from."
      viewAllHref={ROUTES.dashboard.comments}
      viewAllLabel="Browse comments"
    >
      <ul className="grid grid-cols-2 gap-3">
        {top.map((row, index) => (
          <li
            key={row.tld}
            className="rounded-xl p-4 text-center"
            style={{
              background: `var(--viz-tint-${index + 1})`,
              color: "var(--viz-tint-ink)",
            }}
          >
            {/* The tile's tint carries identity; the text stays in ink tokens.
                Slot 4 is yellow — as text on its own tint it is unreadable. */}
            <p
              className="font-mono text-sm"
              style={{ color: "var(--viz-tint-muted)" }}
            >
              <span className="sr-only">Top-level domain </span>
              {row.tld}
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {row.count}
            </p>
            <p className="text-xs" style={{ color: "var(--viz-tint-muted)" }}>
              comments
            </p>
          </li>
        ))}
      </ul>
    </PanelCard>
  )
}
