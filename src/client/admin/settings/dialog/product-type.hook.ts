import { ProductType } from "@/common/db.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"

export interface ProductTypeEdit {
  edit: (body: ProductTypeEditBody) => void
  remove: () => void
}

export interface ProductTypeEditBody {
  name: string,
}

export function useProductTypeEdit(productType?: ProductType): ProductTypeEdit {

  const queryClient = useQueryClient()

  const { mutate: edit } = useMutation(async ({ productType, name }: ProductTypeEditBody & {
    productType?: ProductType
  }) => {

    const url = productType ? `/api/product-types/${productType.name}` : "/api/product-types"
    const method = productType ? "PUT" : "POST"

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
    if (!response.ok) throw new Error(`Failed to edit product type: ${response.statusText}`)
  }, {
    async onSuccess() {
      await queryClient.invalidateQueries([ "products" ])
      await queryClient.invalidateQueries([ "productTypes" ])
    },
  })

  const { mutate: remove } = useMutation(async ({ productType }: { productType?: ProductType }) => {

    if (!productType) return

    const response = await fetch(`/api/product-types/${productType.name}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error(`Failed to delete product type: ${response.statusText}`)
  }, {
    async onSuccess() {
      await queryClient.invalidateQueries([ "productTypes" ])
    },
  })

  return useMemo(() => ({
    edit: (body) => edit({ productType, ...body }),
    remove: () => remove({ productType }),
  }), [ remove, edit, productType ])
}
