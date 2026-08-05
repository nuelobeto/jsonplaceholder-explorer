import { expect, test } from "vitest"

import { filterByQuery } from "./search"

const rows = [
  { id: 1, title: "Quidem molestiae enim", done: true },
  { id: 2, title: "Sunt qui excepturi placeat culpa", done: false },
  { id: 12, title: "Omnis laborum odio", done: false },
]

const fields = (row: (typeof rows)[number]) => [row.id, row.title]

test("an empty or whitespace query matches everything", () => {
  expect(filterByQuery(rows, "", fields)).toHaveLength(3)
  expect(filterByQuery(rows, "   ", fields)).toHaveLength(3)
})

test("matches case-insensitively on substrings", () => {
  expect(filterByQuery(rows, "QUIDEM", fields)).toEqual([rows[0]])
  expect(filterByQuery(rows, "culpa", fields)).toEqual([rows[1]])
})

test("matches across every supplied field, including numbers", () => {
  expect(filterByQuery(rows, "12", fields)).toEqual([rows[2]])
})

test("returns an empty array when nothing matches", () => {
  expect(filterByQuery(rows, "nothing", fields)).toEqual([])
})

test("booleans are stringified, so a status can be searched as text", () => {
  const withStatus = filterByQuery(rows, "true", (row) => [row.done])
  expect(withStatus).toEqual([rows[0]])
})
