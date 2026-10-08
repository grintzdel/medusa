import { Container } from "@medusajs/ui"

import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper">
      <div className="hidden small:block">
        <div className="flex justify-between items-end mb-4 border-b-2 border-ecaille-encre pb-3">
          <h1
            className="ec-display text-[clamp(2.5rem,5vw,3.5rem)] text-ecaille-lien"
            data-testid="welcome-message"
            data-value={customer?.first_name}
          >
            Bonjour {customer?.first_name}
          </h1>
          <span className="text-small-regular text-ecaille-brume">
            Connecté en tant que{" "}
            <span
              className="font-semibold text-ecaille-encre"
              data-testid="customer-email"
              data-value={customer?.email}
            >
              {customer?.email}
            </span>
          </span>
        </div>
        <div className="flex flex-col py-8">
          <div className="flex flex-col gap-y-4 h-full col-span-1 row-span-2 flex-1">
            <div className="flex items-start gap-x-16 mb-6">
              <div className="flex flex-col gap-y-4">
                <h3 className="ec-eyebrow">Profil</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="ec-display text-5xl tabular-nums text-ecaille-encre"
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(customer)}
                  >
                    {getProfileCompletion(customer)}%
                  </span>
                  <span className="uppercase text-base-regular text-ui-fg-subtle">
                    Complété
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-y-4">
                <h3 className="ec-eyebrow">Adresses</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="ec-display text-5xl tabular-nums text-ecaille-encre"
                    data-testid="addresses-count"
                    data-value={customer?.addresses?.length || 0}
                  >
                    {customer?.addresses?.length || 0}
                  </span>
                  <span className="uppercase text-base-regular text-ui-fg-subtle">
                    Enregistrées
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <h2 className="ec-heading text-2xl text-ecaille-encre">
                  Commandes récentes
                </h2>
              </div>
              <ul
                className="flex flex-col gap-y-4"
                data-testid="orders-wrapper"
              >
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => {
                    return (
                      <li
                        key={order.id}
                        data-testid="order-wrapper"
                        data-value={order.id}
                      >
                        <LocalizedClientLink
                          href={`/account/orders/details/${order.id}`}
                        >
                          <Container className="bg-ecaille-sel flex justify-between items-center p-4 rounded-ctl transition-colors hover:bg-ecaille-tuile">
                            <div className="grid grid-cols-3 grid-rows-2 text-small-regular gap-x-4 gap-y-1 flex-1 text-ecaille-encre">
                              <span className="ec-eyebrow">Date</span>
                              <span className="ec-eyebrow">N° de commande</span>
                              <span className="ec-eyebrow">Montant total</span>
                              <span
                                className="font-mono text-xs"
                                data-testid="order-created-date"
                              >
                                {new Date(order.created_at).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                              <span
                                className="font-mono text-xs"
                                data-testid="order-id"
                                data-value={order.display_id}
                              >
                                #{order.display_id}
                              </span>
                              <span
                                className="tabular-nums"
                                data-testid="order-amount"
                              >
                                {convertToLocale({
                                  amount: order.total,
                                  currency_code: order.currency_code,
                                })}
                              </span>
                            </div>
                            <button
                              className="flex items-center justify-between"
                              data-testid="open-order-button"
                            >
                              <span className="sr-only">
                                Voir la commande n°{order.display_id}
                              </span>
                              <ChevronDown className="-rotate-90" />
                            </button>
                          </Container>
                        </LocalizedClientLink>
                      </li>
                    )
                  })
                ) : (
                  <span
                    className="text-ecaille-brume"
                    data-testid="no-orders-message"
                  >
                    Aucune commande récente
                  </span>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
