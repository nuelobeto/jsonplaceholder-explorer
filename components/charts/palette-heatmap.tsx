import { ChartCard, ChartTable } from "@/components/charts/chart-card"
import { HUE_FAMILIES, LIGHTNESS_BANDS } from "@/features/analytics/color"
import type { PaletteGrid } from "@/features/analytics/services"

/** Six steps of one hue, light→dark. A rainbow here would misstate magnitude. */
const RAMP = [
  "var(--viz-seq-0)",
  "var(--viz-seq-1)",
  "var(--viz-seq-2)",
  "var(--viz-seq-3)",
  "var(--viz-seq-4)",
  "var(--viz-seq-5)",
]

const stepFor = (count: number, max: number) =>
  count === 0 ? 0 : 1 + Math.min(4, Math.floor((count / max) * 4.999))

/**
 * Magnitude across a grid, so: heatmap, one sequential hue.
 *
 * Rendered as a real <table> with row and column headers — a screen reader can
 * navigate it as a grid, and each cell carries its count as text, so the colour
 * is never the only encoding.
 */
export const PaletteHeatmap = ({ grid }: { grid: PaletteGrid }) => {
  const countAt = (family: string, band: string) =>
    grid.cells.find((cell) => cell.family === family && cell.band === band)
      ?.count ?? 0

  return (
    <ChartCard
      title="Photo palette"
      description="Every one of the 5,000 photo URLs encodes a colour. Hue is near-uniform — roughly 800 per family — but lightness is a bell curve, and that asymmetry is the whole story of this grid."
      /* No "darker means more" here: the ramp inverts in dark mode, where the
         strongest cells are the lightest. The scale legend carries direction. */
      footnote={`${grid.total.toLocaleString()} colours parsed${grid.unparsed ? `, ${grid.unparsed} unreadable` : ""}. Cells are shaded by photo count — see the scale below. Just 3% of colours land in the darkest lightness band and 3% in the lightest; half sit in the middle.`}
      table={
        <ChartTable
          caption="Photo count by hue family and lightness band"
          headers={["Hue", ...LIGHTNESS_BANDS]}
          rows={HUE_FAMILIES.map((family) => [
            family,
            ...LIGHTNESS_BANDS.map((band) => countAt(family, band)),
          ])}
        />
      }
    >
      {/* Focusable so the grid can be scrolled without a pointer. */}
      <div
        role="region"
        aria-label="Photo palette grid"
        tabIndex={0}
        className="overflow-x-auto focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <table className="w-full min-w-md border-separate border-spacing-[2px]">
          <caption className="sr-only">
            Photo count by hue family and lightness band
          </caption>
          <thead>
            <tr>
              {/* A <td>, not an empty <th> — a header cell with no text is a
                  WCAG failure, and this corner labels nothing. */}
              <td className="w-16" />
              {LIGHTNESS_BANDS.map((band) => (
                <th
                  key={band}
                  scope="col"
                  className="pb-1 text-[11px] font-normal text-muted-foreground tabular-nums"
                >
                  {band}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HUE_FAMILIES.map((family) => (
              <tr key={family}>
                <th
                  scope="row"
                  className="pr-2 text-right text-xs font-normal text-muted-foreground"
                >
                  {family}
                </th>
                {LIGHTNESS_BANDS.map((band) => {
                  const count = countAt(family, band)

                  const step = stepFor(count, grid.max)

                  return (
                    <td
                      key={band}
                      className="h-9 rounded-[4px] text-center text-[11px] tabular-nums"
                      style={{
                        background: RAMP[step],
                        // Each ramp step ships the ink that clears 4.5:1 on it.
                        // The value lives in the cell rather than a tooltip:
                        // the grid scrolls on narrow screens, and a tooltip
                        // anchored inside a scroll container gets clipped.
                        color: `var(--viz-seq-${step}-ink)`,
                      }}
                    >
                      {count.toLocaleString()}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scale legend: a sequential encoding needs its ramp spelled out. */}
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span>0</span>
        <div className="flex gap-[2px]">
          {RAMP.map((step) => (
            <span
              key={step}
              aria-hidden
              className="h-2.5 w-6 rounded-[2px]"
              style={{ background: step }}
            />
          ))}
        </div>
        <span className="tabular-nums">{grid.max.toLocaleString()}</span>
      </div>
    </ChartCard>
  )
}
