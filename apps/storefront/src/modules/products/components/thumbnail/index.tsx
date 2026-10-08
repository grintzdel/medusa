import { clx } from "@medusajs/ui"
import Image from "next/image"
import React from "react"

import Tin from "@modules/common/components/tin"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  // TODO: Fix image typings
  images?: any[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  label?: string
  tone?: unknown
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  label,
  tone,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <div
      className={clx(
        "relative w-full overflow-hidden p-4 bg-ecaille-tuile transition-colors ease-in-out duration-150 group-hover:bg-ecaille-ligne/60",
        className,
        {
          "aspect-[4/5]": isFeatured,
          "aspect-[9/16]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} label={label} tone={tone} />
    </div>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
  label,
  tone,
}: Pick<ThumbnailProps, "size" | "label" | "tone"> & { image?: string }) => {
  return image ? (
    <Image
      src={image}
      alt={label ?? ""}
      className="absolute inset-0 object-cover object-center"
      draggable={false}
      quality={50}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
    />
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center p-[11%]">
      {label ? (
        <Tin label={label} tone={tone} />
      ) : (
        <PlaceholderImage size={size === "small" ? 16 : 24} />
      )}
    </div>
  )
}

export default Thumbnail
