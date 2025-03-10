import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/server/global.type"
import { chargePrismaToObj } from "@/server/mapper.util"
import { withAdminSession, withUserId } from "@/server/session.util"
import { middleware, Middleware, suppress, withMethods, withServerSession, withValidatedBody } from "next-pipe"
import { ChargeStatusKeys } from "@/common/db.type"
import { z } from "zod"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

function withChargeId(): Middleware<NextApiRequest, NextApiResponse, [], [string]> {
  return async (req, res, next) => {
    const { id } = req.query
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid id" })
      return
    }

    await next(id)
  }
}

const ChargeSchema = z.object({
  status: z.enum(ChargeStatusKeys),
})

export default middleware<NextApiRequest, NextApiResponse>()
  .pipe(withChargeId())
  .pipe(
    withMethods(({ get, put }) => {
      get()
        .pipe(withUserId(true), withServerSession(authOptions, false))
        .pipe(async (req, res, next, id, userId, session) => {
          const charge = await prisma.charge.findUnique({
            where: { id },
            include: { product: true },
          })

          if (!charge) {
            res.status(404).json({ error: "Charge not found" })
            return
          }

          if (charge.userId !== userId && !session?.user.roles.includes("ADMIN")) {
            res.status(404).json({ error: "Charge not found" })
            return
          }

          return res.status(200).json(chargePrismaToObj(charge, charge.product))
        })

      put()
        .pipe(suppress(withAdminSession()), withValidatedBody(ChargeSchema))
        .pipe(async (req, res, next, id, body) => {
          await prisma.charge.update({
            where: { id },
            data: { status: body.status },
          })

          res.status(200).end()
        })
    })
  )
