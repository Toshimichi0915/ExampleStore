import { NextApiRequest, NextApiResponse } from "next"
import { chargePrismaToObj } from "@/server/mapper.util"
import { prisma } from "@/server/global.type"
import { withUserId } from "@/server/session.util"
import { middleware, withMethods } from "next-pipe"

export default middleware<NextApiRequest, NextApiResponse>()
  .pipe(withUserId(true))
  .pipe(
    withMethods(({ get }) => {
      get().pipe(async (req, res, next, userId) => {
        const data = (
          await prisma.charge.findMany({
            where: { userId },
            include: { product: true },
          })
        ).map((charge) => chargePrismaToObj(charge, charge.product))

        res.status(200).json(data)
      })
    })
  )
