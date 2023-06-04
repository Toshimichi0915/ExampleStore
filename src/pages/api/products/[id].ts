import { NextApiRequest, NextApiResponse } from "next"
import { isProductAvailable, withAdminSession } from "@/server/session.util"
import { PurchasedProductSchema } from "@/common/product.type"
import { purchasedProductPrismaToObj } from "@/server/mapper.util"
import { prisma } from "@/server/global.type"
import { Middleware, middleware, NextPipe, suppress, withMethods, withValidatedBody } from "next-pipe"

function withProductId(): Middleware<NextApiRequest, NextApiResponse, [], [string]> {
  return async (req, res, next: NextPipe<[string]>) => {
    const { id } = req.query

    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid id" })
      return
    }

    await next(id)
  }
}

export default middleware<NextApiRequest, NextApiResponse>()
  .pipe(withProductId())
  .pipe(
    withMethods(({ get, put, delete: del }) => {
      get().pipe(async (req, res, next, id) => {
        const product = await prisma.product.findUnique({
          where: {
            id,
          },
        })

        if (!product) {
          res.status(404).json({ error: "Product not found" })
          return
        }

        if (!(await isProductAvailable(product, req, res))) {
          res.status(403).json({ error: "Forbidden" })
          return
        }

        res.status(200).json(purchasedProductPrismaToObj(product))
      })

      put()
        .pipe(suppress(withAdminSession()), withValidatedBody(PurchasedProductSchema))
        .pipe(async (req, res, next, id, schema) => {
          const { name, type: typeId, price, content, hasWarranty, hasOriginalMail } = schema
          const product = await prisma.product.update({
            where: { id },
            data: { name, typeId, price, content, hasWarranty, hasOriginalMail },
          })

          if (!product) {
            res.status(404).json({ error: "Product not found" })
            return
          }

          res.status(200).end()
        })

      del()
        .pipe(withAdminSession())
        .pipe(async (req, res, next, id) => {
          const deleted = await prisma.product.delete({
            where: {
              id,
            },
          })

          if (!deleted) {
            res.status(404).json({ error: "Product not found" })
            return
          }

          res.status(200).end()
        })
    })
  )
