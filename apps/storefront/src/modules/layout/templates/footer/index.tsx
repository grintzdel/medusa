import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="w-full bg-ecaille-nuit text-white">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-10 xsmall:flex-row items-start justify-between py-20 small:py-28">
          <div className="flex max-w-xs flex-col gap-4">
            <LocalizedClientLink
              href="/"
              className="ec-display text-[clamp(3.5rem,8vw,6rem)] text-ecaille-citron"
            >
              Écaille
            </LocalizedClientLink>
            <p className="text-[#C3CAE0]">
              Conserverie atlantique. Petite pêche, mise en boîte à Quiberon.
            </p>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="ec-eyebrow text-ecaille-sardine">
                  Catégories
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return
                    }

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null

                    return (
                      <li
                        className="flex flex-col gap-2 text-[#C3CAE0] txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx(
                            "hover:text-ecaille-citron",
                            children && "txt-small-plus"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children &&
                              children.map((child) => (
                                <li key={child.id}>
                                  <LocalizedClientLink
                                    className="hover:text-ecaille-citron"
                                    href={`/categories/${child.handle}`}
                                    data-testid="category-link"
                                  >
                                    {child.name}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="ec-eyebrow text-ecaille-sardine">
                  Collections
                </span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-[#C3CAE0] txt-small",
                    {
                      "grid-cols-2": (collections?.length || 0) > 3,
                    }
                  )}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-ecaille-citron"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="ec-eyebrow text-ecaille-sardine">La conserverie</span>
              <ul className="grid grid-cols-1 gap-y-2 text-[#C3CAE0] txt-small">
                <li>Expédition sous 48 h</li>
                <li>Livraison offerte dès 45 €</li>
                <li>
                  <LocalizedClientLink className="hover:text-ecaille-citron" href="/account">
                    Mon compte
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-wrap gap-4 border-t border-white/15 py-8 justify-between text-ecaille-sardine">
          <Text className="font-mono text-xs">
            © {new Date().getFullYear()} Écaille · Quiberon, Morbihan
          </Text>
          <MedusaCTA />
        </div>
      </div>
    </footer>
  )
}
