import { ProductType } from "@/common/db.type"
import { useQuery } from "@tanstack/react-query"

export function useProductTypes(initialTypes: ProductType[]): ProductType[] {
  const { data } = useQuery([ "productTypes" ], async () => {
    const response = await fetch("/api/product-types")
    if (!response.ok) throw new Error(`Failed to fetch product types: ${response.statusText}`)
    return await response.json()
  }, {
    initialData: initialTypes,
  })

  return data
}
