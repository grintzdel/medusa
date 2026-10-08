import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  variants?: HttpTypes.StoreProductVariant[] | null
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  variants,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const usedValues = new Set(
    (variants ?? []).flatMap((variant) =>
      (variant.options ?? [])
        .filter((variantOption) => variantOption.option_id === option.id)
        .map((variantOption) => variantOption.value)
    )
  )
  const filteredOptions = (option.values ?? [])
    .map((v) => v.value)
    .filter((value) => !variants || usedValues.has(value))

  return (
    <div className="flex flex-col gap-y-3">
      <span className="ec-eyebrow">{title}</span>
      <div
        className="flex flex-wrap justify-between gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "border-ecaille-ligne bg-ui-bg-base border text-sm h-10 rounded-ctl p-2 flex-1 transition-colors ease-in-out duration-150",
                {
                  "border-ecaille-outremer bg-ecaille-outremer text-white": v === current,
                  "hover:border-ecaille-encre": v !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
