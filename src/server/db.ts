import { Charge, ChargeStatus, Product, ProductType, PurchasedProduct } from "@/common/product"
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

export function productPrismaToObj(product: PrismaProduct | Product): Product {
  let type
  if ("typeId" in product) {
    type = product.typeId
  } else {
    type = product.type
  }

  return {
    id: product.id,
    name: product.name,
    type: type,
    price: product.price,
  }
}

export function purchasedProductPrismaToObj(product: PrismaProduct): PurchasedProduct {
  return {
    id: product.id,
    name: product.name,
    type: product.typeId,
    price: product.price,
    content: product.content,
  }
}

export function productTypePrismaToObj(productType: PrismaProductType): ProductType {
  return {
    name: productType.name,
  }
}

export function chargePrismaToObj(charge: PrismaCharge, product: Product | PrismaProduct): Charge {
  return {
    id: charge.id,
    productId: charge.productId,
    userId: charge.userId,
    status: charge.status,
    ...(charge.coinbaseId && { coinbaseId: charge.coinbaseId }),
    ...(charge.chargeUrl && { chargeUrl: charge.chargeUrl }),
    product: productPrismaToObj(product),
  }
}

export async function isProductAvailable(
  product: string | PrismaProduct | Product,
  userId: string,
  session: Session | null
): Promise<boolean> {
  if (session && isAdmin(session)) return true

  let productId
  if (typeof product === "string") {
    productId = product
  } else {
    productId = product.id
  }

  const charge = await prisma.charge.findFirst({
    where: {
      productId: productId,
      userId: userId,
      status: ChargeStatus.RESOLVED,
    },
  })

  if (charge) return true

  return false
}

export function isAdmin(session: Session): boolean {
  return session.user.roles.includes("ADMIN")
}
