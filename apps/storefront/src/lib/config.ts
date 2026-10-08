import { clientIpFrom } from "@lib/util/client-ip"
import { headers as nextHeaders } from "next/headers"
import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const originalFetch = sdk.client.fetch.bind(sdk.client)

sdk.client.fetch = async <T>(
  input: FetchInput,
  init?: FetchArgs
): Promise<T> => {
  const headers = init?.headers ?? {}
  // The backend rate-limits /auth per client IP, and these calls come from
  // the storefront server, so forward the visitor's address.
  if (typeof input === "string" && input.startsWith("/auth/")) {
    try {
      const clientIp = clientIpFrom(await nextHeaders())
      if (clientIp) {
        headers["x-forwarded-for"] = clientIp
      }
    } catch {}
  }

  init = {
    ...init,
    headers,
  }
  return originalFetch(input, init)
}
