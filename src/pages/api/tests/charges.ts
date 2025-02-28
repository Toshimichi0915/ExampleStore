import { middleware, withMethods, withValidatedBody } from "next-pipe"
import { NextApiRequest, NextApiResponse } from "next"
import { ChargeCreateResponse, ChargeCreateSchema } from "@/common/test.type"
import { prisma } from "@/server/global.type"
import { ChargeStatus } from "@/common/db.type"
import { faker } from "@faker-js/faker"
import { getUserId } from "@/server/session.util"

export default middleware<NextApiRequest, NextApiResponse>().pipe(
  withMethods(({ post }) => {
    post()
      .pipe(withValidatedBody(ChargeCreateSchema))
      .pipe(async (req, res, next, body) => {
        const userId = await getUserId(req, res)
        if (!userId) {
          res.status(401).end()
          return
        }

        const charge = await prisma.charge.create({
          data: {
            coinbaseId: faker.string.alpha(20),
            productId: body.productId,
            chargeUrl: "https://example.com",
            userId: userId,
            status: ChargeStatus.CREATED,
          },
        })

        res.status(200).json({ id: charge.id } satisfies ChargeCreateResponse)
      })
  })
)
