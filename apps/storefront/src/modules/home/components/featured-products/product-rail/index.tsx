import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price,+metadata",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-20">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-ecaille-encre pb-3">
        <h2 className="ec-heading text-[clamp(2rem,4vw,3rem)]">
          {collection.title}
        </h2>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          Tout voir
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 gap-x-5 gap-y-12 small:grid-cols-4 small:gap-y-16">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}
