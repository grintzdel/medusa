import { ArrowUpRightMini } from "@medusajs/icons"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404",
  description: "Une erreur est survenue",
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="ec-display text-[clamp(2.5rem,5vw,3.5rem)] text-ecaille-lien">
        Page introuvable
      </h1>
      <p className="text-small-regular text-ecaille-brume">
        La page que vous cherchez n&apos;existe pas.
      </p>
      <Link
        className="flex gap-x-1 items-center group"
        href="/"
      >
        <span className="text-ecaille-lien">Retour à l&apos;accueil</span>
        <ArrowUpRightMini
          className="group-hover:rotate-45 ease-in-out duration-150"
          color="rgb(var(--ec-lien))"
        />
      </Link>
    </div>
  )
}
