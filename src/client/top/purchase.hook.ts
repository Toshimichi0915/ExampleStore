import { Product } from "@/common/db.type"
import { useMemo } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { z } from "zod"
import { ChargeCreateResponse, ChargeCreateSchema } from "@/common/test.type"

export interface ProductItem {
  purchase(): void
}

export function usePurchase(product: Product): ProductItem {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate } = useMutation(
    async () => {
      const response = await fetch("/api/tests/charges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product.id } satisfies z.input<typeof ChargeCreateSchema>),
      })

      if (!response.ok) {
        throw new Error("Failed to purchase")
      }

      return (await response.json()) as ChargeCreateResponse
    },
    {
      async onSuccess(data) {
        await queryClient.invalidateQueries(["charges"])
        await router.push(`/charges/${data.id}`)
      },
    }
  )

  return useMemo(
    () => ({
      purchase: mutate,
    }),
    [mutate]
  )
}
