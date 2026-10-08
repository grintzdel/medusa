import { Text } from "@medusajs/ui"
import TransferActions from "@modules/order/components/transfer-actions"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        <h1 className="ec-display text-[clamp(2rem,4vw,2.75rem)] text-ecaille-lien">
          Demande de transfert de la commande {id}
        </h1>
        <Text className="text-ui-fg-subtle">
          Vous avez reçu une demande de transfert de propriété de votre commande
          ({id}). Si vous acceptez cette demande, vous pouvez approuver le
          transfert en cliquant sur le bouton ci-dessous.
        </Text>
        <div className="w-full h-px bg-ecaille-ligne" />
        <Text className="text-ui-fg-subtle">
          Si vous acceptez, le nouveau propriétaire reprendra l&apos;ensemble des
          responsabilités et autorisations associées à cette commande.
        </Text>
        <Text className="text-ui-fg-subtle">
          Si vous ne reconnaissez pas cette demande ou souhaitez rester
          propriétaire, aucune action n&apos;est nécessaire.
        </Text>
        <div className="w-full h-px bg-ecaille-ligne" />
        <TransferActions id={id} token={token} />
      </div>
    </div>
  )
}
