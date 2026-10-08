export const clientIpFrom = (headers: Pick<Headers, "get">): string | null => {
  const realIp = headers.get("x-real-ip")?.trim()
  if (realIp) {
    return realIp
  }

  const forwardedFor = headers
    .get("x-forwarded-for")
    ?.split(",")
    .map((ip) => ip.trim())
    .filter(Boolean)

  return forwardedFor?.at(-1) ?? null
}
