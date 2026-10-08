import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="ec-eyebrow hover:text-ecaille-lien"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <h1
          className="ec-display text-[clamp(2.75rem,5vw,4rem)] text-ecaille-lien"
          data-testid="product-title"
        >
          {product.title}
        </h1>

        <Text
          className="text-base leading-relaxed text-ecaille-brume whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
