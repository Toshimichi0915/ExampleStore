import { middleware, suppress, withMethods, withValidatedBody } from "next-pipe"
import { NextApiRequest, NextApiResponse } from "next"
import { withAdminSession } from "@/server/session.util"
import { z } from "zod"
import { prisma } from "@/server/global.type"
import { chargePrismaToObj } from "@/server/mapper.util"

export const LogSchema = z.object({
  cursor: z.string().optional(),
  take: z.number().default(100),
  skip: z.number().default(0),
})

export default middleware<NextApiRequest, NextApiResponse>()
  .pipe(suppress(withAdminSession()))
  .pipe(
    withMethods(({ post }) => {
      post()
        .pipe(withValidatedBody(LogSchema))
        .pipe(async (req, res, next, schema) => {
          const charges = await prisma.charge.findMany({
            ...(schema.cursor && {
              cursor: {
                id: schema.cursor,
              },
            }),
            include: {
              product: true,
            },

            take: schema.take,
            skip: schema.skip,
            orderBy: {
              createdAt: "desc",
            },
          })

          res.status(200).json(charges.map((charge) => chargePrismaToObj(charge, charge.product)))
        })
    })
  )
