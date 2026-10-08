import { ArrowUpRightMini } from "@medusajs/icons"
import LocalizedClientLink from "../localized-client-link"

type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
}

const InteractiveLink = ({
  href,
  children,
  onClick,
  ...props
}: InteractiveLinkProps) => {
  return (
    <LocalizedClientLink
      className="flex gap-x-1 items-center group"
      href={href}
      onClick={onClick}
      {...props}
    >
      <span className="txt-compact-medium text-ecaille-lien">{children}</span>
      <ArrowUpRightMini
        className="group-hover:rotate-45 ease-in-out duration-150"
        color="rgb(var(--ec-lien))"
      />
    </LocalizedClientLink>
  )
}

export default InteractiveLink
