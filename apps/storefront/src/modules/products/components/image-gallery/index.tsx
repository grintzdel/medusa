import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"

import Tin from "@modules/common/components/tin"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  title: string
  tone?: unknown
}

const ImageGallery = ({ images, title, tone }: ImageGalleryProps) => {
  if (!images.length) {
    return (
      <div className="flex items-start relative">
        <div className="flex flex-1 small:mx-16 aspect-[29/34] items-center justify-center bg-ecaille-tuile p-[12%]">
          <Tin label={title} tone={tone} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
        {images.map((image, index) => {
          return (
            <Container
              key={image.id}
              className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle"
              id={image.id}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  priority={index <= 2 ? true : false}
                  className="absolute inset-0 rounded-rounded"
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
            </Container>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
