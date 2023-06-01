import { NextApiRequest, NextApiResponse } from "next"
import { withAdminSession } from "@/server/session.util"
import { productTypePrismaToObj } from "@/server/mapper.util"
import { prisma } from "@/server/prisma.util"
import { middleware, withMethods } from "next-pipe"

export default middleware<NextApiRequest, NextApiResponse>().pipe(
  withMethods(({ get, post }) => {
    get().pipe(async (req, res) => {
      const productTypes = (
        await prisma.productType.findMany({
          orderBy: { createdAt: "desc" },
        })
      ).map(productTypePrismaToObj)

      res.status(200).json(productTypes)
    })

    post()
      .pipe(withAdminSession())
      .pipe(async (req, res) => {
        const { name } = req.body
        if (typeof name !== "string") {
          res.status(400).json({ error: "Invalid name" })
          return
        }

        const productType = await prisma.productType.create({
          data: { name },
        })

        res.status(200).json(productTypePrismaToObj(productType))
      })
  }),
)
