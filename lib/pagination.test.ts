import { describe, expect, test } from "vitest"

import { PAGE_SIZE, paginate, parsePageParam } from "./pagination"

const items = (count: number) => Array.from({ length: count }, (_, i) => i + 1)

describe("parsePageParam", () => {
  test("accepts positive integers", () => {
    expect(parsePageParam("1")).toBe(1)
    expect(parsePageParam("7")).toBe(7)
  })

  test("falls back to page 1 for anything else", () => {
    for (const raw of [undefined, "", "0", "-3", "1.5", "abc", "1e2x"]) {
      expect(parsePageParam(raw)).toBe(1)
    }
  })
})

describe("paginate", () => {
  test("slices the requested page", () => {
    const result = paginate(items(PAGE_SIZE * 2), 2)
    expect(result.items).toHaveLength(PAGE_SIZE)
    expect(result.items[0]).toBe(PAGE_SIZE + 1)
    expect(result.currentPage).toBe(2)
    expect(result.totalPages).toBe(2)
    expect(result.total).toBe(PAGE_SIZE * 2)
  })

  test("clamps a page past the end to the last page", () => {
    const result = paginate(items(PAGE_SIZE + 1), 99)
    expect(result.currentPage).toBe(2)
    expect(result.items).toEqual([PAGE_SIZE + 1])
  })

  test("reports a single page when everything fits", () => {
    const result = paginate(items(PAGE_SIZE), 1)
    expect(result.totalPages).toBe(1)
    expect(result.items).toHaveLength(PAGE_SIZE)
  })

  test("an empty list is still one page, not zero", () => {
    const result = paginate([], 1)
    expect(result.totalPages).toBe(1)
    expect(result.currentPage).toBe(1)
    expect(result.items).toEqual([])
    expect(result.total).toBe(0)
  })

  test("a partial last page returns only the remainder", () => {
    const result = paginate(items(PAGE_SIZE + 3), 2)
    expect(result.items).toHaveLength(3)
  })
})
