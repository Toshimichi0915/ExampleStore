import { Charge, ChargeStatus } from "@/common/db.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"

interface ChargeEdit {
  edit({ status }: { status: ChargeStatus }): void
}

export function useChargeEdit(charge: Charge): ChargeEdit {
  const queryClient = useQueryClient()

  const { mutate: edit } = useMutation(
    async ({ status }: { status: ChargeStatus }) => {
      const response = await fetch(`/api/charges/${charge.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      })
      if (!response.ok) throw new Error(`Failed to edit charge: ${response.statusText}`)
    },
    {
      async onSuccess() {
        await queryClient.invalidateQueries(["charges", charge.id])
      },
    }
  )

  return useMemo(() => {
    return {
      edit,
    }
  }, [edit])
}
