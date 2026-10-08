import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import { ShoppingBag, User } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import NavLinks, { NavLink } from "@modules/layout/components/nav-links"
import NavShell from "@modules/layout/components/nav-shell"
import SideMenu from "@modules/layout/components/side-menu"
import ThemeToggle from "@modules/layout/components/theme-toggle"

const iconButtonClassName =
  "flex h-10 w-10 items-center justify-center rounded-ctl text-ecaille-encre transition-colors hover:bg-ecaille-tuile focus-visible:outline focus-visible:outline-2 focus-visible:outline-ecaille-lien"

export default async function Nav() {
  const [regions, locales, currentLocale, categories] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    listCategories().catch((error) => {
      console.error("Nav: failed to load categories", error)
      return []
    }),
  ])

  const links: NavLink[] = [
    { label: "Toutes les conserves", href: "/store" },
    ...categories
      .filter((category) => !category.parent_category)
      .slice(0, 5)
      .map((category) => ({
        label: category.name,
        href: `/categories/${category.handle}`,
      })),
  ]

  return (
    <NavShell
      announcement={
        <p className="px-4 py-2 text-center font-mono text-[12px] uppercase tracking-[0.08em] text-ecaille-nuit">
          Livraison offerte dès 45 €
          <span className="max-xsmall:hidden">
            {" "}
            · Expédié sous 48 h depuis Quiberon
          </span>
        </p>
      }
    >
      <nav className="content-container flex h-full w-full items-center gap-x-6 text-[15px] text-ecaille-encre">
        <div className="flex items-center gap-x-2 small:hidden">
          <SideMenu
            links={links}
            regions={regions}
            locales={locales}
            currentLocale={currentLocale}
          />
        </div>

        <LocalizedClientLink
          href="/"
          className="ec-display text-[30px] leading-none text-ecaille-lien max-small:absolute max-small:left-1/2 max-small:-translate-x-1/2"
          data-testid="nav-store-link"
        >
          Écaille
        </LocalizedClientLink>

        <NavLinks links={links} />

        <div className="ml-auto flex items-center gap-x-1">
          <ThemeToggle />
          <LocalizedClientLink
            href="/account"
            className={`${iconButtonClassName} max-small:hidden`}
            aria-label="Mon compte"
            data-testid="nav-account-link"
          >
            <User />
          </LocalizedClientLink>
          <Suspense
            fallback={
              <LocalizedClientLink
                className={iconButtonClassName}
                href="/cart"
                aria-label="Panier"
                data-testid="nav-cart-link"
              >
                <ShoppingBag />
              </LocalizedClientLink>
            }
          >
            <CartButton />
          </Suspense>
        </div>
      </nav>
    </NavShell>
  )
}
