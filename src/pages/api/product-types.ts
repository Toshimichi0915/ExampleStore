import { NextApiRequest, NextApiResponse } from "next"
import { withAdminSession } from "@/server/session.util"
import { productTypePrismaToObj } from "@/server/mapper.util"
import { prisma } from "@/server/global.type"
import { middleware, withMethods } from "next-pipe"
import { getProductTypes } from "@/server/db"

export default middleware<NextApiRequest, NextApiResponse>().pipe(
  withMethods(({ get, post }) => {
    get().pipe(async (req, res) => {
      res.status(200).json(await getProductTypes())
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
  })
)
