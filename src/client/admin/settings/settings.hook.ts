import { ProductType, PurchasedProduct } from "@/common/db.type"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

export interface Settings {
  products: PurchasedProduct[]
  productTypes: ProductType[]
  loaded: boolean
}

export function useSettings(initialProducts: PurchasedProduct[], initialProductTypes: ProductType[]): Settings {
  const { data: products, isSuccess: isProductSuccess } = useQuery(["products"], async () => {
    const response = await fetch("/api/products")
    if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`)
    return await response.json()
  })

  const { data: productTypes, isSuccess: isProductTypeSuccess } = useQuery(["productTypes"], async () => {
    const response = await fetch("/api/product-types")
    if (!response.ok) throw new Error(`Failed to fetch product types: ${response.statusText}`)
    return await response.json()
  })

  return useMemo(
    () => ({
      products: products ?? initialProducts,
      productTypes: productTypes ?? initialProductTypes,
      loaded: isProductSuccess && isProductTypeSuccess,
    }),
    [products, initialProducts, productTypes, initialProductTypes, isProductSuccess, isProductTypeSuccess]
  )
}
