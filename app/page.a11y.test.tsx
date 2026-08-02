import { expect, test } from "vitest"
import { render } from "@testing-library/react"
import { axe } from "vitest-axe"
import * as matchers from "vitest-axe/matchers"
import Page from "./page"

expect.extend(matchers)

test("index page has no a11y violations", async () => {
  const { container } = render(<Page />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
