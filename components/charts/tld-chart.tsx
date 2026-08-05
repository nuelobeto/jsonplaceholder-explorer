import {
  ChartCard,
  ChartTable,
  ChartTooltip,
} from "@/components/charts/chart-card"
import type { TldRow } from "@/features/analytics/services"

/**
 * One series, so every bar wears slot 1 and there is no legend — the title
 * already names what is plotted. Shading bars by their own length would
 * double-encode magnitude and burn the only free channel.
 */
export const TldChart = ({ rows }: { rows: TldRow[] }) => {
  const max = Math.max(...rows.map((row) => row.count))
  const total = rows.reduce((sum, row) => sum + row.count, 0)

  return (
    <ChartCard
      title="Commenter email domains"
      description="All 500 comments carry a unique-ish sender. 496 distinct hosts collapse into just 12 top-level domains."
      footnote={`${total} comments across ${rows.length} top-level domains.`}
      table={
        <ChartTable
          caption="Comment count by top-level domain"
          headers={["Domain", "Comments", "Share"]}
          rows={rows.map((row) => [
            row.tld,
            row.count,
            `${((row.count / total) * 100).toFixed(1)}%`,
          ])}
        />
      }
    >
      <ul className="space-y-2">
        {rows.map((row) => (
          <li key={row.tld} className="group relative flex items-center gap-3">
            <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">
              {row.tld}
            </span>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div
                className="h-4 rounded-r-[4px]"
                style={{
                  width: `${(row.count / max) * 100}%`,
                  background: "var(--viz-1)",
                }}
              />
              {/* Bars carry the value at the tip; the axis is redundant here. */}
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {row.count}
              </span>
            </div>
            <ChartTooltip>
              {row.tld} — {row.count} comments (
              {((row.count / total) * 100).toFixed(1)}%)
            </ChartTooltip>
          </li>
        ))}
      </ul>
    </ChartCard>
  )
}
