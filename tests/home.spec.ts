import { test, expect } from "@playwright/test"

test("index page renders its content", async ({ page }) => {
  await page.goto("/")

  // the heading
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Explore the JSONPlaceholder API/i,
    })
  ).toBeVisible()

  // the body copy
  await expect(
    page.getByText("Browse users, posts, photos, albums, comments, and todos", {
      exact: false,
    })
  ).toBeVisible()

  // the primary call to action
  await expect(
    page.getByRole("link", { name: "Open the dashboard" }).first()
  ).toBeVisible()
})

test("section anchors scroll to their sections", async ({ page }) => {
  await page.goto("/")

  await page.getByRole("link", { name: "See features" }).click()
  await expect(
    page.getByRole("heading", { level: 2, name: "What you can do" })
  ).toBeInViewport()
})

test("resource counts settle on their final values", async ({ page }) => {
  await page.goto("/")

  await page.locator("#resources").scrollIntoViewIfNeeded()
  await expect(page.locator("#resources")).toContainText("5,000")
})
