import { NextApiRequest, NextApiResponse } from "next"
import { withAdminSession } from "@/server/session.util"
import { PurchasedProductSchema } from "@/common/product.type"
import { purchasedProductPrismaToObj } from "@/server/mapper.util"
import { prisma } from "@/server/global.type"
import { middleware, suppress, withMethods, withValidatedBody } from "next-pipe"
import { ChargeStatus } from "@/common/db.type"

export default middleware<NextApiRequest, NextApiResponse>().pipe(
  suppress(withAdminSession()),
  withMethods(({ get, post }) => {
    get().pipe(async (req, res) => {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          charges: { none: { status: ChargeStatus.RESOLVED } },
        },
      })

      res.status(200).json(products.map(purchasedProductPrismaToObj))
    })

    post()
      .pipe(withValidatedBody(PurchasedProductSchema))
      .pipe(async (req, res, next, schema) => {
        const { name, type: typeId, price, content } = schema
        const product = await prisma.product.create({
          data: { name, typeId, price, content },
        })

        res.status(200).json(purchasedProductPrismaToObj(product))
      })
  })
)
