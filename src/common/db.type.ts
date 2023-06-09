export interface Product {
  id: string
  name: string
  type?: string | null | undefined
  price: number
  unswappable: boolean
  hasOriginalMail: boolean
  note?: string | null | undefined
}

export interface PurchasedProduct extends Product {
  content: string
}

export interface ProductType {
  name: string
  weight: number
}

export interface Charge {
  id: string
  productId: string
  userId: string
  coinbaseId?: string | null | undefined
  chargeUrl?: string | null | undefined
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

export interface Environment {
  telegramUrl: string
  termsOfService?: object | null | undefined
}
