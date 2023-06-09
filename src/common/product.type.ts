import { z } from "zod"

export const PurchasedProductSchema = z.object({
  name: z.string(),
  type: z.string().nullable(),
  price: z.number(),
  content: z.string(),
  hasWarranty: z.boolean(),
  hasOriginalMail: z.boolean(),
  note: z.string().optional(),
})

export type PurchasedProductInput = z.input<typeof PurchasedProductSchema>

export const ProductTypeSchema = z.object({
  name: z.string(),
})

export type ProductTypeInput = z.input<typeof ProductTypeSchema>
