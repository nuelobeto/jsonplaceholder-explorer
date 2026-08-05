import {
  ChartCard,
  ChartTable,
  ChartTooltip,
} from "@/components/charts/chart-card"
import type { CompletionRow } from "@/features/analytics/services"

/**
 * Two series (done / remaining), so a legend is mandatory. The remaining
 * segment is a lighter step of slot 1's own ramp — the meter-track rule — and
 * the 2px gap between the two fills is the surface doing the separating, not a
 * stroke around the marks.
 */
export const CompletionChart = ({ rows }: { rows: CompletionRow[] }) => {
  const totalDone = rows.reduce((sum, row) => sum + row.done, 0)
  const total = rows.reduce((sum, row) => sum + row.total, 0)

  return (
    <ChartCard
      title="Todo completion by user"
      description="The one per-user metric with real spread — posts, albums and todos are otherwise identical across all ten accounts."
      footnote={`${totalDone} of ${total} todos complete overall (${Math.round((totalDone / total) * 100)}%). Sorted by completion rate.`}
      table={
        <ChartTable
          caption="Todo completion by user"
          headers={["User", "Done", "Remaining", "Total", "Rate"]}
          rows={rows.map((row) => [
            row.name,
            row.done,
            row.total - row.done,
            row.total,
            `${Math.round((row.done / row.total) * 100)}%`,
          ])}
        />
      }
    >
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="size-2.5 rounded-full"
            style={{ background: "var(--viz-1)" }}
          />
          Done
        </span>
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="size-2.5 rounded-full"
            style={{ background: "var(--viz-track)" }}
          />
          Remaining
        </span>
      </div>

      <ul className="mt-4 space-y-2.5">
        {rows.map((row) => {
          const percent = Math.round((row.done / row.total) * 100)

          return (
            <li key={row.userId} className="group relative">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate">{row.name}</span>
                <span className="shrink-0 text-muted-foreground tabular-nums">
                  {row.done}/{row.total}
                </span>
              </div>

              <div className="mt-1.5 flex h-5 gap-[2px]">
                <div
                  className="rounded-r-[4px]"
                  style={{
                    width: `${percent}%`,
                    background: "var(--viz-1)",
                  }}
                />
                <div
                  className="flex-1 rounded-r-[4px]"
                  style={{ background: "var(--viz-track)" }}
                />
              </div>

              <ChartTooltip>
                {row.name} — {row.done} done, {row.total - row.done} remaining (
                {percent}%)
              </ChartTooltip>
            </li>
          )
        })}
      </ul>
    </ChartCard>
  )
}
