import type { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/**
 * Wrapper for every chart on the dashboard.
 *
 * `overflow-visible` is deliberate: Card clips by default, which would cut off
 * the hover tooltips that escape a mark's bounds.
 */
export const ChartCard = ({
  title,
  description,
  footnote,
  table,
  children,
}: {
  title: string
  description: string
  footnote?: string
  table: ReactNode
  children: ReactNode
}) => (
  <Card className="overflow-visible rounded-2xl shadow-sm">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription className="text-pretty">{description}</CardDescription>
    </CardHeader>
    <CardContent>
      {children}
      {footnote && (
        <p className="mt-4 text-xs text-pretty text-muted-foreground">
          {footnote}
        </p>
      )}
      {/*
        The table twin. Light-mode slots aqua/yellow/magenta sit under 3:1 on
        white, so the validator's relief rule applies — no value may be
        colour-only. Direct labels cover it on screen; this covers the rest.
      */}
      <details className="group mt-4">
        <summary className="w-fit cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
          Table view
        </summary>
        <div
          tabIndex={0}
          className="mt-3 overflow-x-auto focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {table}
        </div>
      </details>
    </CardContent>
  </Card>
)

/** Shared table styling for the chart table twins. */
export const ChartTable = ({
  caption,
  headers,
  rows,
}: {
  caption: string
  headers: string[]
  rows: Array<Array<string | number>>
}) => (
  <table className="w-full text-sm">
    <caption className="sr-only">{caption}</caption>
    <thead>
      <tr className="border-b text-xs text-muted-foreground">
        {headers.map((header, index) => (
          <th
            key={header}
            scope="col"
            className={
              index === 0 ? "py-1.5 pr-3 text-left" : "py-1.5 pr-3 text-right"
            }
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr key={String(row[0])} className="border-b last:border-0">
          {row.map((cell, index) => (
            <td
              key={index}
              className={
                index === 0
                  ? "py-1.5 pr-3"
                  : "py-1.5 pr-3 text-right tabular-nums"
              }
            >
              {typeof cell === "number" ? cell.toLocaleString() : cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)

/** Hover/focus readout. Sits above the mark and never intercepts the pointer. */
export const ChartTooltip = ({ children }: { children: ReactNode }) => (
  <span
    role="tooltip"
    /* `hidden` rather than opacity-0: an invisible-but-laid-out tooltip still
       contributes to the page's scrollWidth and pushed the body sideways. */
    className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 hidden -translate-x-1/2 rounded-lg border bg-popover px-2.5 py-1.5 text-xs whitespace-nowrap text-popover-foreground shadow-md group-focus-within:block group-hover:block"
  >
    {children}
  </span>
)
