import {
  PrismaClient,
  Product as PrismaProduct,
  ProductType as PrismaProductType,
  Charge as PrismaCharge,
} from "@prisma/client"
import { Session } from "next-auth"

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") globalThis.prisma = client

export const prisma = client

export interface Product {
  id: string
  name: string
  type: string | null
  price: number
  content?: string
  available: boolean
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

export function productPrismaToObj(
  product: PrismaProduct & { charges: { userId: string; status: string }[] },
  userId: string | undefined,
  session: Session | null
): Product {
  const available =
    (session && isAdmin(session)) ||
    product.charges.some((charge) => charge.userId === userId && charge.status === ChargeStatus.RESOLVED)

  const res: Product = {
    id: product.id,
    name: product.name,
    type: product.typeId,
    price: product.price,
    content: product.content,
    available,
  }

  if (!available) {
    delete res.content
  }

  return res
}

export function productTypePrismaToObj(productType: PrismaProductType): ProductType {
  return {
    name: productType.name,
  }
}

export function chargePrismaToObj(charge: PrismaCharge): Charge {
  return {
    id: charge.id,
    productId: charge.productId,
    userId: charge.userId,
    status: charge.status,
    ...(charge.coinbaseId && { coinbaseId: charge.coinbaseId }),
    ...(charge.chargeUrl && { chargeUrl: charge.chargeUrl }),
  }
}

export async function isProductAvailable(product: Product | PrismaProduct, session: Session): Promise<boolean> {
  if (isAdmin(session)) return true

  const charge = await prisma.charge.findFirst({
    where: {
      productId: product.id,
      userId: session.user.id,
      status: ChargeStatus.RESOLVED,
    },
  })

  if (charge) return true

  return false
}

export function isAdmin(session: Session): boolean {
  return session.user.roles.includes("ADMIN")
}
