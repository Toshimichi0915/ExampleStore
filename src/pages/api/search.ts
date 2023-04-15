import { NextApiRequest, NextApiResponse } from "next"
import { ZodError } from "zod/lib"
import { productPrismaToObj } from "@/server/mapper.util"
import { prisma } from "@/server/prisma.util"
import { ChargeStatus } from "@/common/db.type"
import { SearchSchema } from "@/common/search.type"

export const prismaSortOptions = {
  new: { createdAt: "desc" },
  old: { createdAt: "asc" },
  expensive: { price: "desc" },
  cheap: { price: "asc" },
} as const

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const result = SearchSchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ error: result.error as ZodError })
      return
    }

    const { query, types, sort } = result.data

    const response = (
      await prisma.product.findMany({
        where: {
          name: { contains: query },
          ...types.length > 0 && { typeId: { in: types } },
          charges: { none: { NOT: { status: ChargeStatus.FAILED } } },
        },
        orderBy: prismaSortOptions[sort],
      })
    ).map((product) => productPrismaToObj(product))

    res.status(200).json(response)
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
