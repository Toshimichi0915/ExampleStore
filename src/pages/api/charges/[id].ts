import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/server/prisma.util"
import { chargePrismaToObj } from "@/server/mapper.util"
import { withUserId } from "@/server/session.util"
import { middleware, Middleware, withMethods } from "next-pipe"

function withChargeId(): Middleware<NextApiRequest, NextApiResponse, [], [ string ]> {
  return async (req, res, next) => {
    const { id } = req.query
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid id" })
      return
    }

    await next(id)
  }
}

export default middleware<NextApiRequest, NextApiResponse>()
  .pipe(withUserId(true), withChargeId())
  .pipe(
    withMethods(({ get }) => {
      get().pipe(async (req, res, next, userId, id) => {
        const charge = await prisma.charge.findUnique({
          where: { id },
          include: { product: true },
        })

        if (!charge) {
          res.status(404).json({ error: "Charge not found" })
          return
        }

        if (charge.userId !== userId) {
          res.status(404).json({ error: "Charge not found" })
          return
        }

        return res.status(200).json(chargePrismaToObj(charge, charge.product))
      })
    }),
  )
