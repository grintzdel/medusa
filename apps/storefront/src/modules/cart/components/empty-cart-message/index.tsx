import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div className="py-48 px-2 flex flex-col justify-center items-start" data-testid="empty-cart-message">
      <h1
        className="ec-display text-[clamp(2.5rem,5vw,3.5rem)] text-ecaille-lien"
      >
        Panier
      </h1>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem] text-ecaille-brume">
        Votre panier est vide. Le millésime 2024 vous attend dans la
        boutique.
      </Text>
      <div>
        <InteractiveLink href="/store">Voir les conserves</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
