import { NextApiRequest, NextApiResponse } from "next"
import { withAdminSession } from "@/server/session.util"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { productTypePrismaToObj } from "@/server/mapper.util"
import { prisma } from "@/server/global.type"
import { ProductTypeSchema } from "@/common/product.type"
import { Middleware, middleware, suppress, withMethods, withServerSession, withValidatedBody } from "next-pipe"

function withProductTypeId(): Middleware<NextApiRequest, NextApiResponse, [], [string]> {
  return async (req, res, next) => {
    const { name } = req.query
    if (typeof name !== "string") {
      res.status(400).json({ error: "Invalid id" })
      return
    }

    await next(name)
  }
}

export default middleware<NextApiRequest, NextApiResponse>()
  .pipe(suppress(withServerSession(authOptions, true)), withProductTypeId())
  .pipe(
    withMethods(({ get, put, delete: del }) => {
      get().pipe(async (req, res, next, name) => {
        const productType = await prisma.productType.findUnique({
          where: { name },
        })

        if (!productType) {
          res.status(404).json({ error: "Product type not found" })
          return
        }

        res.status(200).json(productTypePrismaToObj(productType))
      })

      put()
        .pipe(suppress(withAdminSession()), withValidatedBody(ProductTypeSchema))
        .pipe(async (req, res, next, name, schema) => {
          if (schema.name === name) {
            res.status(200).end()
            return
          }

          const existingProductType = await prisma.productType.findUnique({
            where: { name: schema.name },
          })

          if (existingProductType) {
            await prisma.$transaction([
              prisma.product.updateMany({ where: { typeId: name }, data: { typeId: schema.name } }),
              prisma.productType.delete({ where: { name } }),
            ])
          } else {
            const productType = await prisma.productType.update({
              where: { name },
              data: { name: schema.name },
            })

            if (!productType) {
              res.status(404).json({ error: "Product type not found" })
              return
            }
          }

          res.status(200).end()
        })

      del()
        .pipe(suppress(withAdminSession()))
        .pipe(async (req, res, next, name) => {
          const [, deleted] = await prisma.$transaction([
            prisma.product.updateMany({
              where: { typeId: name },
              data: { typeId: undefined },
            }),
            prisma.productType.delete({ where: { name } }),
          ])

          if (!deleted) {
            res.status(404).json({ error: "Product type not found" })
            return
          }
          res.status(200).end()
        })
    })
  )
