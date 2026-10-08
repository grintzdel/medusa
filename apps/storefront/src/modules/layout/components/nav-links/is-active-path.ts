export const isActivePath = (
  pathname: string,
  countryCode: string,
  href: string
) => {
  const path = pathname.replace(`/${countryCode}`, "") || "/"
  return path === href || path.startsWith(`${href}/`)
}
