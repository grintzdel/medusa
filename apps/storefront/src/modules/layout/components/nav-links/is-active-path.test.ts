import { describe, expect, it } from "vitest"

import { isActivePath } from "./is-active-path"

describe("isActivePath", () => {
  it("matches the exact page under the country prefix", () => {
    expect(isActivePath("/fr/store", "fr", "/store")).toBe(true)
  })

  it("matches nested pages of a section", () => {
    expect(isActivePath("/fr/categories/sardines/millesimees", "fr", "/categories/sardines")).toBe(true)
  })

  it("does not match a sibling sharing the same prefix", () => {
    expect(isActivePath("/fr/categories/sardines-citron", "fr", "/categories/sardines")).toBe(false)
  })

  it("treats the bare country root as the home page", () => {
    expect(isActivePath("/fr", "fr", "/")).toBe(true)
    expect(isActivePath("/fr", "fr", "/store")).toBe(false)
  })
})
