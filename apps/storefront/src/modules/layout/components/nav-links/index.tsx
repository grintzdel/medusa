"use client"

import { clx } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

import { isActivePath } from "./is-active-path"

export type NavLink = {
  label: string
  href: string
}

export const useIsActiveLink = () => {
  const pathname = usePathname()
  const { countryCode } = useParams<{ countryCode: string }>()

  return (href: string) => isActivePath(pathname, countryCode, href)
}

const NavLinks = ({ links }: { links: NavLink[] }) => {
  const isActive = useIsActiveLink()

  return (
    <ul className="hidden h-full items-center gap-x-1 small:flex">
      {links.map(({ label, href }) => {
        const active = isActive(href)

        return (
          <li key={href} className="h-full">
            <LocalizedClientLink
              href={href}
              aria-current={active ? "page" : undefined}
              className={clx(
                "relative flex h-full items-center px-3 font-medium transition-colors hover:text-ecaille-lien",
                "after:absolute after:inset-x-3 after:bottom-[-1px] after:h-[3px] after:origin-left after:rounded-full after:bg-ecaille-citron after:transition-transform after:duration-200",
                active
                  ? "text-ecaille-lien after:scale-x-100"
                  : "after:scale-x-0 hover:after:scale-x-100"
              )}
            >
              {label}
            </LocalizedClientLink>
          </li>
        )
      })}
    </ul>
  )
}

export default NavLinks
