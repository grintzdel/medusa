import { acceptTransferRequest } from "@lib/data/orders"
import { Text } from "@medusajs/ui"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  const { success, error } = await acceptTransferRequest(id, token)

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        {success && (
          <>
            <h1 className="ec-display text-[clamp(2rem,4vw,2.75rem)] text-ecaille-lien">
              Commande transférée !
            </h1>
            <Text className="text-ui-fg-subtle">
              La commande {id} a bien été transférée à son nouveau propriétaire.
            </Text>
          </>
        )}
        {!success && (
          <>
            <Text className="text-ui-fg-subtle">
              Une erreur est survenue lors de l&apos;acceptation du transfert.
              Veuillez réessayer.
            </Text>
            {error && (
              <Text className="text-ecaille-piment">
                Message d&apos;erreur : {error}
              </Text>
            )}
          </>
        )}
      </div>
    </div>
  )
}
