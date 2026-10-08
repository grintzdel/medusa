import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import Divider from "@modules/common/components/divider"
import TransferRequestForm from "@modules/account/components/transfer-request-form"

export const metadata: Metadata = {
  title: "Commandes",
  description: "Historique de vos commandes.",
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="ec-display text-[clamp(2.5rem,5vw,3.5rem)] text-ecaille-lien">
          Commandes
        </h1>
        <p className="text-base-regular text-ecaille-brume">
          Retrouvez vos commandes passées et leur statut. Vous pouvez aussi
          demander un retour ou un échange si besoin.
        </p>
      </div>
      <div>
        <OrderOverview orders={orders} />
        <Divider className="my-16" />
        <TransferRequestForm />
      </div>
    </div>
  )
}
