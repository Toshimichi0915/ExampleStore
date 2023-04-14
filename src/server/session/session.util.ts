import { Product as PrismaProduct } from "@prisma/client"
import { Session } from "next-auth"
import { ChargeStatus, Product } from "@/common/db.type"
import { client, prisma } from "@/server/prisma.util"

if (process.env.NODE_ENV !== "production") globalThis.prisma = client

export async function isProductAvailable(
  product: string | PrismaProduct | Product,
  userId: string,
  session: Session | null,
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

  return !!charge
}

export function isAdmin(session: Session): boolean {
  return session.user.roles.includes("ADMIN")
}
