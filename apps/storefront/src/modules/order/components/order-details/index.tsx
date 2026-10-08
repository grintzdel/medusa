import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const STATUS_LABELS: Record<string, string> = {
  not_fulfilled: "En préparation",
  partially_fulfilled: "Partiellement préparée",
  fulfilled: "Préparée",
  partially_shipped: "Partiellement expédiée",
  shipped: "Expédiée",
  partially_delivered: "Partiellement livrée",
  delivered: "Livrée",
  not_paid: "Non payée",
  awaiting: "En attente",
  requires_action: "Action requise",
  authorized: "Autorisé",
  partially_authorized: "Partiellement autorisé",
  captured: "Payée",
  partially_captured: "Partiellement payée",
  refunded: "Remboursée",
  partially_refunded: "Partiellement remboursée",
  canceled: "Annulée",
}

const formatStatus = (status: string) => {
  if (STATUS_LABELS[status]) {
    return STATUS_LABELS[status]
  }
  const formatted = status.split("_").join(" ")
  return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {

  return (
    <div>
      <Text>
        Nous avons envoyé la confirmation de commande à{" "}
        <span
          className="text-ui-fg-base font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        Date de commande :{" "}
        <span className="font-mono text-xs" data-testid="order-date">
          {new Date(order.created_at).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </Text>
      <Text className="mt-2 text-ecaille-lien">
        Numéro de commande :{" "}
        <span className="font-mono text-xs" data-testid="order-id">
          {order.display_id}
        </span>
      </Text>

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <>
            <Text>
              Statut de la commande :{" "}
              <span className="text-ui-fg-subtle " data-testid="order-status">
                {formatStatus(order.fulfillment_status)}
              </span>
            </Text>
            <Text>
              Statut du paiement :{" "}
              <span
                className="text-ui-fg-subtle "
                data-testid="order-payment-status"
              >
                {formatStatus(order.payment_status)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
