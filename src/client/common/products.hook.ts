import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { Product } from "@/common/db.type"

export interface Products {
  products: Product[]
  loaded: boolean
}

export function useProducts(initialData?: Product[]): Products {
  const { data, isSuccess } = useQuery([ "products", "simple" ], async () => {
    const response = await fetch("/api/products")
    if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`)
    return await response.json()
  })

  return useMemo(
    () => ({
      products: data ?? initialData ?? [],
      loaded: isSuccess,
    }),
    [ data, initialData, isSuccess ],
  )
}
