import { Charge as PrismaCharge, Product as PrismaProduct, ProductType as PrismaProductType } from "@prisma/client"
import { Charge, Product, ProductType, PurchasedProduct } from "@/common/db.type"

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
    type,
    price: product.price,
    unswappable: product.unswappable,
    hasOriginalMail: product.hasOriginalMail,
    note: product.note,
  }
}

export function purchasedProductPrismaToObj(product: PrismaProduct): PurchasedProduct {
  return {
    id: product.id,
    name: product.name,
    type: product.typeId,
    price: product.price,
    content: product.content,
    unswappable: product.unswappable,
    hasOriginalMail: product.hasOriginalMail,
    note: product.note,
  }
}

export function productTypePrismaToObj(productType: PrismaProductType): ProductType {
  return {
    name: productType.name,
    weight: productType.weight as number,
  }
}

export function chargePrismaToObj(charge: PrismaCharge, product: Product | PrismaProduct): Charge {
  return {
    id: charge.id,
    productId: charge.productId,
    userId: charge.userId,
    status: charge.status,
    coinbaseId: charge.coinbaseId,
    chargeUrl: charge.chargeUrl,
    product: productPrismaToObj(product),
    createdAt: charge.createdAt.toUTCString(),
  }
}
