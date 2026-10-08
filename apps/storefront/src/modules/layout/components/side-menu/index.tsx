"use client"

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { ArrowRightMini, BarsThree, XMark } from "@medusajs/icons"
import { clx, useToggleState } from "@medusajs/ui"
import { useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { NavLink, useIsActiveLink } from "../nav-links"
import { HttpTypes } from "@medusajs/types"

const secondaryLinks: NavLink[] = [
  { label: "Mon compte", href: "/account" },
  { label: "Panier", href: "/cart" },
]

type SideMenuProps = {
  links: NavLink[]
  regions: HttpTypes.StoreRegion[] | null
}

const SideMenu = ({ links, regions }: SideMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const countryToggleState = useToggleState()
  const isActive = useIsActiveLink()

  const close = () => setIsOpen(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="-ml-2 flex h-10 w-10 items-center justify-center rounded-ctl hover:bg-ecaille-tuile focus-visible:outline focus-visible:outline-2 focus-visible:outline-ecaille-lien"
        aria-label="Ouvrir le menu"
        data-testid="nav-menu-button"
      >
        <BarsThree />
      </button>

      <Dialog open={isOpen} onClose={close} className="relative z-[60]">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-ecaille-nuit/50 backdrop-blur-sm transition-opacity duration-300 ease-out data-[closed]:opacity-0"
          data-testid="side-menu-backdrop"
        />
        <DialogPanel
          transition
          className="fixed inset-y-0 left-0 flex w-[min(88vw,380px)] flex-col bg-ecaille-outremer text-white shadow-2xl transition-transform duration-300 ease-out data-[closed]:-translate-x-full"
          data-testid="nav-menu-popup"
        >
          <div className="flex h-16 items-center justify-between px-6">
            <span className="ec-display text-[30px] leading-none text-ecaille-citron">
              Écaille
            </span>
            <button
              type="button"
              onClick={close}
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-ctl hover:bg-white/10"
              aria-label="Fermer le menu"
              data-testid="close-menu-button"
            >
              <XMark />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4">
            <span className="ec-eyebrow text-white/60">Conserves</span>
            <ul className="mt-3 flex flex-col">
              {links.map(({ label, href }) => (
                <li key={href} className="border-b border-white/10">
                  <LocalizedClientLink
                    href={href}
                    onClick={close}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={clx(
                      "group flex items-center justify-between ec-heading py-3 text-3xl transition-colors hover:text-ecaille-citron",
                      isActive(href) && "text-ecaille-citron"
                    )}
                  >
                    {label}
                    <ArrowRightMini className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>

            <ul className="mt-8 flex flex-col gap-3">
              {secondaryLinks.map(({ label, href }) => (
                <li key={href}>
                  <LocalizedClientLink
                    href={href}
                    onClick={close}
                    className="text-base font-medium text-white/80 hover:text-white"
                    data-testid={href === "/account" ? "account-link" : "cart-link"}
                  >
                    {label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-y-4 border-t border-white/10 px-6 py-5 text-sm">
            <div
              className="flex justify-between"
              onMouseEnter={countryToggleState.open}
              onMouseLeave={countryToggleState.close}
            >
              {regions && (
                <CountrySelect toggleState={countryToggleState} regions={regions} />
              )}
              <ArrowRightMini
                className={clx(
                  "transition-transform duration-150",
                  countryToggleState.state ? "-rotate-90" : ""
                )}
              />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/50">
              © {new Date().getFullYear()} Écaille, conserverie atlantique
            </p>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  )
}

export default SideMenu
