import { createCharge } from "@/server/coinbase.util"
import { NextApiRequest, NextApiResponse } from "next"

import { prisma } from "@/server/prisma.util"
import { getUserId } from "@/server/session.util"
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

      const userId = await getUserId(req, res, true)

      try {
        res.status(200).json(await createCharge(product, userId))
      } catch (e) {
        if (e instanceof Error) {
          res.status(400).json({ error: e.message })
        } else {
          // this shouldn't happen
          throw e
        }
      }
    })
  })
)
