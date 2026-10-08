"use client"

import { useActionState } from "react"
import { createTransferRequest } from "@lib/data/orders"
import { Text, Input, IconButton } from "@medusajs/ui"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { CheckCircleMiniSolid, XCircleSolid } from "@medusajs/icons"
import { useEffect, useState } from "react"

export default function TransferRequestForm() {
  const [showSuccess, setShowSuccess] = useState(false)

  const [state, formAction] = useActionState(createTransferRequest, {
    success: false,
    error: null,
    order: null,
  })

  useEffect(() => {
    if (state.success && state.order) {
      setShowSuccess(true)
    }
  }, [state.success, state.order])

  return (
    <div className="flex flex-col gap-y-4 w-full">
      <div className="grid sm:grid-cols-2 items-center gap-x-8 gap-y-4 w-full">
        <div className="flex flex-col gap-y-1">
          <h3 className="ec-heading text-2xl text-ecaille-encre">
            Transfert de commande
          </h3>
          <Text className="text-base-regular text-ecaille-brume">
            Vous ne trouvez pas la commande que vous cherchez ?
            <br /> Rattachez une commande à votre compte.
          </Text>
        </div>
        <form
          action={formAction}
          className="flex flex-col gap-y-1 sm:items-end"
        >
          <div className="flex flex-col gap-y-2 w-full">
            <Input className="w-full" name="order_id" placeholder="Numéro de commande" />
            <SubmitButton
              variant="secondary"
              className="w-fit whitespace-nowrap self-end"
            >
              Demander le transfert
            </SubmitButton>
          </div>
        </form>
      </div>
      {!state.success && state.error && (
        <Text className="text-base-regular text-ecaille-piment text-right">
          {state.error}
        </Text>
      )}
      {showSuccess && (
        <div className="flex justify-between p-4 bg-ecaille-tuile shadow-borders-base rounded-ctl w-full self-stretch items-center">
          <div className="flex gap-x-2 items-center">
            <CheckCircleMiniSolid className="w-4 h-4 text-ecaille-algue" />
            <div className="flex flex-col gap-y-1">
              <Text className="text-medim-pl text-ecaille-encre">
                Transfert demandé pour la commande{" "}
                <span className="font-mono text-xs">{state.order?.id}</span>
              </Text>
              <Text className="text-base-regular text-ecaille-brume">
                E-mail de demande de transfert envoyé à {state.order?.email}
              </Text>
            </div>
          </div>
          <IconButton
            variant="transparent"
            className="h-fit"
            onClick={() => setShowSuccess(false)}
          >
            <XCircleSolid className="w-4 h-4 text-ecaille-brume" />
          </IconButton>
        </div>
      )}
    </div>
  )
}
