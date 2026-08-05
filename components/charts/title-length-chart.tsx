import {
  ChartCard,
  ChartTable,
  ChartTooltip,
} from "@/components/charts/chart-card"
import type { LengthBucket } from "@/features/analytics/services"

/**
 * A distribution over an ordered numeric axis, so columns rather than bars.
 * Only the tallest column is direct-labelled — a number on every column is the
 * fastest way to make a chart unreadable.
 */
export const TitleLengthChart = ({ buckets }: { buckets: LengthBucket[] }) => {
  const max = Math.max(...buckets.map((bucket) => bucket.count))
  const total = buckets.reduce((sum, bucket) => sum + bucket.count, 0)

  return (
    <ChartCard
      title="Post title lengths"
      description="Lorem ipsum has a shape: title lengths cluster hard in the middle of the range."
      footnote={`${total} posts, titles from 12 to 79 characters.`}
      table={
        <ChartTable
          caption="Post count by title length"
          headers={["Characters", "Posts"]}
          rows={buckets.map((bucket) => [bucket.label, bucket.count])}
        />
      }
    >
      <div className="relative">
        {/* Recessive hairline grid, solid — never dashed. */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-40">
          {[0, 25, 50, 75, 100].map((offset) => (
            <div
              key={offset}
              className="absolute inset-x-0 border-t"
              style={{ top: `${offset}%`, borderColor: "var(--viz-grid)" }}
            />
          ))}
        </div>

        <ul className="relative flex h-40 items-end gap-2">
          {buckets.map((bucket) => (
            <li
              key={bucket.label}
              className="group relative flex h-full flex-1 flex-col justify-end"
            >
              {bucket.count === max && (
                <span className="mb-1 text-center text-xs text-muted-foreground tabular-nums">
                  {bucket.count}
                </span>
              )}
              <div
                className="mx-auto w-full max-w-6 rounded-t-[4px]"
                style={{
                  height: `${(bucket.count / max) * 100}%`,
                  background: "var(--viz-1)",
                }}
              />
              <ChartTooltip>
                {bucket.label} characters — {bucket.count} posts
              </ChartTooltip>
            </li>
          ))}
        </ul>

        <div
          className="border-t"
          style={{ borderColor: "var(--viz-axis)" }}
          aria-hidden
        />

        <ul className="mt-2 flex gap-2">
          {buckets.map((bucket) => (
            <li
              key={bucket.label}
              className="flex-1 text-center text-[11px] text-muted-foreground tabular-nums"
            >
              {bucket.label}
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  )
}
