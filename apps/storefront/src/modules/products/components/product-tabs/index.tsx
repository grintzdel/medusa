"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Traçabilité",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Livraison et retours",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const readMetadata = (product: HttpTypes.StoreProduct, key: string) => {
  const value = product.metadata?.[key]
  return typeof value === "string" ? value : "-"
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const rows = [
    { label: "Poids net", value: product.weight ? `${product.weight} g` : "-" },
    { label: "Port de débarque", value: readMetadata(product, "port") },
    { label: "Lot", value: readMetadata(product, "lot") },
    { label: "À consommer de préférence avant", value: readMetadata(product, "ddm") },
    { label: "Origine", value: product.origin_country?.toUpperCase() ?? "-" },
  ]

  return (
    <dl className="grid grid-cols-1 gap-y-3 py-6 text-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between gap-4 border-b border-ui-border-base pb-3">
          <dt className="text-ecaille-brume">{row.label}</dt>
          <dd className="font-mono text-xs uppercase text-ecaille-encre">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Expédié sous 48 h</span>
            <p className="max-w-sm">
              Les colis partent de Quiberon et arrivent en 2 à 4 jours ouvrés, à
              domicile ou en point relais. Livraison offerte dès 45 €.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Boîte abîmée à la livraison</span>
            <p className="max-w-sm">
              Envoyez-nous une photo dans les 14 jours et nous renvoyons la
              boîte, sans frais.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Retours</span>
            <p className="max-w-sm">
              Les boîtes non ouvertes sont reprises sous 14 jours. Le
              remboursement est fait à réception.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
