import { clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <>
      {price.price_type === "sale" && (
        <span
          className="text-sm text-ecaille-brume line-through"
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
      <span
        className={clx("font-semibold text-ecaille-encre", {
          "text-ecaille-piment": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </span>
    </>
  )
}
