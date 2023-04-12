import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string(),
  type: z.string().nullable(),
  price: z.number(),
  content: z.string(),
})

export interface Product {
  id: string
  name: string
  type: string | null
  price: number
}

export interface PurchasedProduct extends Product {
  content: string
}

export interface ProductType {
  name: string
}

export interface Charge {
  id: string
  productId: string
  userId: string
  coinbaseId?: string
  chargeUrl?: string
  status: ChargeStatus
  product: Product
}

export const ChargeStatus = {
  CREATED: "CREATED",
  CONFIRMED: "CONFIRMED",
  FAILED: "FAILED",
  DELAYED: "DELAYED",
  PENDING: "PENDING",
  RESOLVED: "RESOLVED",
} as const

export type ChargeStatus = typeof ChargeStatus[keyof typeof ChargeStatus]
