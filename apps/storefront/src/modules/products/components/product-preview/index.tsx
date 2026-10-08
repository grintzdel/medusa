import { getPricePerKg } from "@lib/util/get-price-per-kg"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

const getTraceability = (product: HttpTypes.StoreProduct) => {
  const port = product.metadata?.port
  const lot = product.metadata?.lot
  return [
    product.weight ? `${product.weight} g` : null,
    typeof port === "string" ? port : null,
    typeof lot === "string" ? `LOT ${lot}` : null,
  ].filter(Boolean)
}

export default async function ProductPreview({
  product,
  isFeatured,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const traceability = getTraceability(product)
  const pricePerKg = cheapestPrice
    ? getPricePerKg({
        amount: cheapestPrice.calculated_price_number,
        weightInGrams: product.weight,
        currencyCode: cheapestPrice.currency_code,
      })
    : null

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper" className="flex flex-col gap-3">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
          label={product.title}
          tone={product.metadata?.tin}
        />
        <div className="flex flex-col gap-1">
          <h3
            className="text-base font-semibold leading-snug text-ecaille-encre group-hover:text-ecaille-lien"
            data-testid="product-title"
          >
            {product.title}
          </h3>
          {traceability.length > 0 && (
            <span className="font-mono text-xs text-ecaille-brume">
              {traceability.join(" · ")}
            </span>
          )}
        </div>
        {cheapestPrice && (
          <div className="flex flex-col">
            <div className="flex items-baseline gap-x-2 tabular-nums">
              <PreviewPrice price={cheapestPrice} />
            </div>
            {pricePerKg && (
              <span className="font-mono text-xs text-ecaille-brume">
                {pricePerKg}
              </span>
            )}
          </div>
        )}
      </div>
    </LocalizedClientLink>
  )
}
