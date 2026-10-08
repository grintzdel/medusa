"use client"

import { resetOnboardingState } from "@lib/data/onboarding"
import { Button, Container, Text } from "@medusajs/ui"

const OnboardingCta = ({ orderId }: { orderId: string }) => {
  return (
    <Container className="max-w-4xl h-full bg-ui-bg-subtle w-full rounded-none">
      <div className="flex flex-col gap-y-4 center p-4 md:items-center">
        <Text className="text-ui-fg-base text-xl">
          Votre commande de test a bien été créée ! 🎉
        </Text>
        <Text className="text-ui-fg-subtle text-small-regular">
          Vous pouvez maintenant finaliser la configuration de votre boutique
          dans l'admin.
        </Text>
        <Button
          className="w-fit rounded-ctl"
          size="xlarge"
          onClick={() => resetOnboardingState(orderId)}
        >
          Finaliser la configuration dans l'admin
        </Button>
      </div>
    </Container>
  )
}

export default OnboardingCta
