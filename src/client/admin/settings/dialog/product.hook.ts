import { Product } from "@/common/db.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { PurchasedProductInput } from "@/common/product.type"

export interface ProductEdit {
  edit(body: ProductEditBody): void

  remove: () => void
}

export interface ProductEditBody {
  name: string
  type: string
  price: number
  content: string
  unswappable: boolean
  hasOriginalMail: boolean
  note: string
}

export function useProductEdit(product?: Product): ProductEdit {
  const queryClient = useQueryClient()

  const { mutate: edit } = useMutation(
    async ({
      product,
      name,
      type,
      price,
      content,
      unswappable,
      hasOriginalMail,
      note,
    }: ProductEditBody & {
      product?: Product
    }) => {
      const url = product ? `/api/products/${product.id}` : "/api/products"
      const method = product ? "PUT" : "POST"
      const value: PurchasedProductInput = {
        name,
        type,
        price,
        content,
        unswappable,
        hasOriginalMail,
        note: note || undefined,
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      })
      if (!response.ok) throw new Error(`Failed to edit product: ${response.statusText}`)
    },
    {
      async onSuccess() {
        await queryClient.invalidateQueries(["search"])
        await queryClient.invalidateQueries(["products"])
      },
    }
  )

  const { mutate: remove } = useMutation(
    async ({ product }: { product?: Product }) => {
      if (!product) return

      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error(`Failed to delete product: ${response.statusText}`)
    },
    {
      async onSuccess() {
        await queryClient.invalidateQueries(["search"])
        await queryClient.invalidateQueries(["products"])
      },
    }
  )

  return useMemo(
    () => ({
      edit: (body) => edit({ product, ...body }),
      remove: () => remove({ product }),
    }),
    [remove, edit, product]
  )
}
