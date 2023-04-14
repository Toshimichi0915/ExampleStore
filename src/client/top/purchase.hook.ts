import { Product } from "@/common/db.type"
import { useMemo } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/router"

export interface ProductItem {
  purchase: () => void
}

export function usePurchase(product: Product): ProductItem {

  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate } = useMutation(async () => {
    const response = await fetch(`/api/products/${product.id}/purchase`, {
      method: "POST",
    })
    if (!response.ok) throw new Error(`Failed to purchase product: ${response.statusText}`)
    return await response.json()
  }, {
    async onSuccess() {
      await queryClient.invalidateQueries([ "products" ])
      await router.push(`/products/${product.id}`)
    },
  })

  return useMemo(() => ({
    purchase: mutate,
  }), [ mutate ])
}
