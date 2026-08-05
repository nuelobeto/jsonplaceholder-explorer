import { expect, test } from "vitest"

import type { User } from "./schema"
import { filterUsers, getInitials } from "./utils"

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  name: "Leanne Graham",
  username: "Bret",
  email: "Sincere@april.biz",
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org",
  address: {
    street: "Kulas Light",
    suite: "Apt. 556",
    city: "Gwenborough",
    zipcode: "92998-3874",
    geo: { lat: "-37.3159", lng: "81.1496" },
  },
  company: {
    name: "Romaguera-Crona",
    catchPhrase: "Multi-layered client-server neural-net",
    bs: "harness real-time e-markets",
  },
  ...overrides,
})

const leanne = makeUser()
const ervin = makeUser({
  id: 2,
  name: "Ervin Howell",
  username: "Antonette",
  email: "Shanna@melissa.tv",
  website: "anastasia.net",
  address: { ...leanne.address, city: "Wisokyburgh" },
  company: { ...leanne.company, name: "Deckow-Crist" },
})

const users = [leanne, ervin]

test("returns every user for an empty or whitespace query", () => {
  expect(filterUsers(users, "")).toHaveLength(2)
  expect(filterUsers(users, "   ")).toHaveLength(2)
})

test("matches on name, case-insensitively", () => {
  expect(filterUsers(users, "leanne")).toEqual([leanne])
  expect(filterUsers(users, "Leanne")).toEqual([leanne])
})

test("matches on username, email, company, and city", () => {
  expect(filterUsers(users, "Antonette")).toEqual([ervin])
  expect(filterUsers(users, "melissa.tv")).toEqual([ervin])
  expect(filterUsers(users, "Romaguera")).toEqual([leanne])
  expect(filterUsers(users, "Gwenborough")).toEqual([leanne])
})

test("matches on a partial substring", () => {
  expect(filterUsers(users, "how")).toEqual([ervin])
})

test("returns nothing when there is no match", () => {
  expect(filterUsers(users, "nobody")).toEqual([])
})

test("builds initials from the first two name parts, skipping titles", () => {
  expect(getInitials("Leanne Graham")).toBe("LG")
  expect(getInitials("Mrs. Dennis Schulist")).toBe("DS")
  expect(getInitials("Nicholas Runolfsdottir V")).toBe("NR")
})
