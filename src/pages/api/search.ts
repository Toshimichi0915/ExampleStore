import { NextApiRequest, NextApiResponse } from "next"
import { productPrismaToObj } from "@/server/mapper.util"
import { prisma } from "@/server/prisma.util"
import { ChargeStatus } from "@/common/db.type"
import { SearchSchema } from "@/common/search.type"
import { middleware, withMethods, withValidatedBody } from "next-pipe"

export const prismaSortOptions = {
  new: { createdAt: "desc" },
  old: { createdAt: "asc" },
  expensive: { price: "desc" },
  cheap: { price: "asc" },
} as const

export default middleware<NextApiRequest, NextApiResponse>().pipe(
  withMethods(({ post }) => {
    post()
      .pipe(withValidatedBody(SearchSchema))
      .pipe(async (req, res, next, schema) => {
        const { query, types, sort } = schema

        const response = (
          await prisma.product.findMany({
            where: {
              name: { contains: query },
              ...(types.length > 0 && { typeId: { in: types } }),
              charges: { none: { NOT: { status: ChargeStatus.FAILED } } },
            },
            orderBy: prismaSortOptions[sort],
          })
        ).map((product) => productPrismaToObj(product))

        res.status(200).json(response)
      })
  })
)
