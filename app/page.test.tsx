import { expect, test } from "vitest"
import { render, screen } from "@testing-library/react"
import Page from "./page"
import { ROUTES } from "@/lib/constants"

test("renders the hero", () => {
  render(<Page />)
  expect(
    screen.getByRole("heading", {
      level: 1,
      name: /Explore the JSONPlaceholder API/i,
    })
  ).toBeDefined()
})

test("renders every landing section", () => {
  render(<Page />)
  for (const name of [
    "What you can do",
    "Six resources to explore",
    "Why this exists",
  ]) {
    expect(screen.getByRole("heading", { level: 2, name })).toBeDefined()
  }
})

test("points visitors at the dashboard", () => {
  render(<Page />)
  const links = screen.getAllByRole("link", { name: /dashboard/i })
  expect(links.length).toBeGreaterThan(0)
  for (const link of links) {
    // There is no /dashboard index route — overview is the entry point.
    expect(link.getAttribute("href")).toBe(ROUTES.dashboard.overview)
  }
})
