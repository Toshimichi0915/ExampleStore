import { useQuery } from "@tanstack/react-query"
import { Charge, PurchasedProduct } from "@/common/db.type"
import { useMemo } from "react"

export interface LoadedProductContent {
  product: PurchasedProduct
  loading: false
}

export interface LoadingProductContent {
  product: undefined
  loading: true
}

export type ProductContent = LoadedProductContent | LoadingProductContent

export function useProductContent(charge: Charge): ProductContent {
  const { data, isLoading } = useQuery([ "products", charge.productId ], async () => {
    const response = await fetch(`/api/products/${charge.productId}`)
    if (!response.ok) throw new Error(`Failed to fetch product: ${response.statusText}`)
    return await response.json()
  })

  return useMemo(() => {
    return { product: data, loading: isLoading }
  }, [ data, isLoading ])
}
