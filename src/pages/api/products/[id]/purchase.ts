import { createCharge } from "@/server/coinbase.util"
import { NextApiRequest, NextApiResponse } from "next"

import { prisma } from "@/server/prisma.util"
import { getUserId } from "@/server/session.util"
import { ChargeStatus } from "@/common/db.type"
import { middleware, withMethods } from "next-pipe"

export default middleware<NextApiRequest, NextApiResponse>().pipe(
  withMethods(({ post }) => {
    post().pipe(async (req, res) => {
      // origin check to prevent CSRF attack
      const origin = req.headers.origin
      if (origin !== process.env.NEXTAUTH_URL) {
        res.status(403).json({ error: "Forbidden" })
        return
      }

      const { id } = req.query
      if (typeof id !== "string") {
        res.status(400).json({ error: "Invalid id" })
        return
      }

      const product = await prisma.product.findUnique({
        where: {
          id,
        },
      })

      if (!product) {
        res.status(404).json({ error: "Product not found" })
        return
      }

      const existingCharge = await prisma.charge.findFirst({
        where: {
          productId: product.id,
          status: { not: ChargeStatus.FAILED },
        },
      })

      if (existingCharge) {
        res.status(409).json({ error: "Product already purchased" })
        return
      }

      const userId = await getUserId(req, res, true)

      res.status(200).json(await createCharge(product, userId))
    })
  })
)
