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
  INITIALIZING: "INITIALIZING",
  CREATED: "CREATED",
  CONFIRMED: "CONFIRMED",
  FAILED: "FAILED",
  DELAYED: "DELAYED",
  PENDING: "PENDING",
  RESOLVED: "RESOLVED",
  INVALIDATED: "INVALIDATED",
} as const

export type ChargeStatus = (typeof ChargeStatus)[keyof typeof ChargeStatus]

export const ChargeStatusNames = {
  INITIALIZING: "Initializing",
  CREATED: "Created",
  CONFIRMED: "Confirmed",
  FAILED: "Failed",
  DELAYED: "Delayed",
  PENDING: "Pending",
  RESOLVED: "Completed",
  INVALIDATED: "Invalidated",
} as const satisfies { [key in ChargeStatus]: string }
