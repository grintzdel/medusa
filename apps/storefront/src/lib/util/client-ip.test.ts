import { describe, expect, it } from "vitest"
import { clientIpFrom } from "./client-ip"

describe("clientIpFrom", () => {
  it("prefers x-real-ip set by the hosting proxy", () => {
    const headers = new Headers({ "x-real-ip": "203.0.113.7", "x-forwarded-for": "198.51.100.1" })

    expect(clientIpFrom(headers)).toBe("203.0.113.7")
  })

  it("takes the hop appended by the nearest proxy, not a client-supplied one", () => {
    const headers = new Headers({ "x-forwarded-for": "6.6.6.6, 203.0.113.7" })

    expect(clientIpFrom(headers)).toBe("203.0.113.7")
  })

  it("returns null without proxy headers", () => {
    expect(clientIpFrom(new Headers())).toBeNull()
  })
})
