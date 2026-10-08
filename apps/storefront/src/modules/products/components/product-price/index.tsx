import { clx } from "@medusajs/ui"

import { getPricePerKg } from "@lib/util/get-price-per-kg"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-ecaille-tuile animate-pulse" />
  }

  const pricePerKg = getPricePerKg({
    amount: selectedPrice.calculated_price_number,
    weightInGrams: variant?.weight ?? product.weight,
    currencyCode: selectedPrice.currency_code,
  })

  return (
    <div className="flex flex-col gap-1 text-ecaille-encre tabular-nums">
      <span
        className={clx("text-2xl font-semibold", {
          "text-ecaille-piment": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && "À partir de "}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </span>
      {pricePerKg && (
        <span className="font-mono text-xs text-ecaille-brume">
          {pricePerKg}
        </span>
      )}
      {selectedPrice.price_type === "sale" && (
        <>
          <p>
            <span className="text-ecaille-brume">Prix initial : </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="self-start rounded-soft bg-ecaille-piment px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-white">
            −{selectedPrice.percentage_diff} %
          </span>
        </>
      )}
    </div>
  )
}
