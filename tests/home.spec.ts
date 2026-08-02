import { test, expect } from "@playwright/test"

test("index page renders its content", async ({ page }) => {
  await page.goto("/")

  // the heading
  await expect(
    page.getByRole("heading", { level: 1, name: "Project ready!" })
  ).toBeVisible()

  // the body copy
  await expect(
    page.getByText("You may now add components and start building.")
  ).toBeVisible()

  // the button
  await expect(page.getByRole("button", { name: "Button" })).toBeVisible()
})
