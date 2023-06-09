import { Product } from "@/common/db.type"
import { useMemo } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/router"

export interface ProductItem {
  purchase(): void
}

export function usePurchase(product: Product): ProductItem {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate } = useMutation(
    async () => {
      const response = await fetch(`/api/products/${product.id}/purchase`, {
        method: "POST",
      })
      if (!response.ok) throw new Error(`Failed to purchase product: ${response.statusText}`)
      return await response.json()
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
