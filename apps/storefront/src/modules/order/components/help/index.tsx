import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-6">
      <h3 className="ec-eyebrow text-ui-fg-base">Besoin d&apos;aide ?</h3>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <LocalizedClientLink
              href="/contact"
              className="hover:text-ecaille-lien"
            >
              Contact
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink
              href="/contact"
              className="hover:text-ecaille-lien"
            >
              Retours et échanges
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
