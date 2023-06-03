import { ProductType } from "@/common/db.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { ProductTypeInput } from "@/common/product.type"

export interface ProductTypeEdit {
  edit(body: ProductTypeEditBody): void

  remove(): void

  moveUp(): void

  moveDown(): void
}

export interface ProductTypeEditBody {
  name: string
}

export function useProductTypeEdit(productTypes: ProductType[], productType?: ProductType): ProductTypeEdit {
  const queryClient = useQueryClient()

  const { mutate: edit } = useMutation(
    async ({
      productType,
      name,
    }: ProductTypeEditBody & {
      productType?: ProductType
    }) => {
      const url = productType ? `/api/product-types/${productType.name}` : "/api/product-types"
      const method = productType ? "PUT" : "POST"
      const value: ProductTypeInput = { name }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      })
      if (!response.ok) throw new Error(`Failed to edit product type: ${response.statusText}`)
    },
    {
      async onSuccess() {
        await queryClient.invalidateQueries(["search"])
        await queryClient.invalidateQueries(["products"])
        await queryClient.invalidateQueries(["productTypes"])
      },
    }
  )

  const { mutate: remove } = useMutation(
    async ({ productType }: { productType?: ProductType }) => {
      if (!productType) return

      const response = await fetch(`/api/product-types/${productType.name}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error(`Failed to delete product type: ${response.statusText}`)
    },
    {
      async onSuccess() {
        await queryClient.invalidateQueries(["search"])
        await queryClient.invalidateQueries(["products"])
        await queryClient.invalidateQueries(["productTypes"])
      },
    }
  )

  const { mutate: move } = useMutation(
    async ({
      productType,
      productTypes,
      delta,
    }: {
      productType?: ProductType
      productTypes: ProductType[]
      delta: number
    }) => {
      if (!productType) return

      const swapAgainst = productTypes[productTypes.indexOf(productType) + delta]
      if (!swapAgainst) return

      const response = await fetch(`/api/product-types/swap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name1: productType.name,
          name2: swapAgainst.name,
        }),
      })

      if (!response.ok) throw new Error(`Failed to move product type up: ${response.statusText}`)
    },
    {
      async onSuccess() {
        await queryClient.invalidateQueries(["search"])
        await queryClient.invalidateQueries(["products"])
        await queryClient.invalidateQueries(["productTypes"])
      },
    }
  )

  return useMemo(
    () => ({
      edit: (body) => edit({ productType, ...body }),
      remove: () => remove({ productType }),
      moveUp: () => move({ productType, productTypes, delta: -1 }),
      moveDown: () => move({ productType, productTypes, delta: 1 }),
    }),
    [edit, productType, remove, move, productTypes]
  )
}
