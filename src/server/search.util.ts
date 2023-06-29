import { SearchSchema } from "@/common/search.type"
import { prisma } from "@/server/global.type"
import { ChargeStatus, Product } from "@/common/db.type"
import { productPrismaToObj } from "@/server/mapper.util"
import { z } from "zod"

export const prismaSortOptions = {
  new: { createdAt: "desc" },
  old: { createdAt: "asc" },
  expensive: { price: "desc" },
  cheap: { price: "asc" },
} as const

export async function searchProducts(schema: z.output<typeof SearchSchema>): Promise<Product[]> {
  return (
    await prisma.product.findMany({
      ...(schema.cursor && {
        cursor: {
          id: schema.cursor,
        },
      }),
      where: {
        name: { contains: schema.query, mode: "insensitive" },
        ...(schema.types.length > 0 && { typeId: { in: schema.types } }),
        charges: { none: { status: ChargeStatus.RESOLVED } },
      },
      skip: schema.skip,
      take: schema.take,
      orderBy: [prismaSortOptions[schema.sort], { id: "desc" }],
    })
  ).map((product) => productPrismaToObj(product))
}
