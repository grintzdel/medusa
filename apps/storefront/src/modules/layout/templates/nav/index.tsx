import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import ThemeToggle from "@modules/layout/components/theme-toggle"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <p className="bg-ecaille-citron px-4 py-2 text-center text-[13px] font-medium text-ecaille-nuit">
        Livraison offerte dès 45 € · Expédié sous 48 h depuis Quiberon
      </p>
      <header className="relative h-16 mx-auto border-b duration-200 bg-ui-bg-base border-ui-border-base">
        <nav className="content-container text-ecaille-encre flex items-center justify-between w-full h-full text-[15px]">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="ec-display text-[32px] text-ecaille-lien"
              data-testid="nav-store-link"
            >
              Écaille
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-4 small:gap-x-6 h-full flex-1 basis-0 justify-end">
            <ThemeToggle />
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink className="hover:text-ecaille-lien" href="/store">
                Conserves
              </LocalizedClientLink>
              <LocalizedClientLink
                className="hover:text-ecaille-lien"
                href="/account"
                data-testid="nav-account-link"
              >
                Compte
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ecaille-lien flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Panier (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
