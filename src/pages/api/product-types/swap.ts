import { z } from "zod"
import { middleware, suppress, withValidatedBody } from "next-pipe"
import { NextApiRequest, NextApiResponse } from "next"
import { withAdminSession } from "@/server/session.util"
import { prisma } from "@/server/global.type"

export const SwapSchema = z.object({
  name1: z.string(),
  name2: z.string(),
})

export default middleware<NextApiRequest, NextApiResponse>()
  .pipe(suppress(withAdminSession()), withValidatedBody(SwapSchema))
  .pipe(async (req, res, next, body) => {
    const productType1 = await prisma.productType.findUnique({
      where: { name: body.name1 },
    })

    if (!productType1) {
      res.status(404).json({ error: "Product type not found" })
      return
    }

    const productType2 = await prisma.productType.findUnique({
      where: { name: body.name2 },
    })

    if (!productType2) {
      res.status(404).json({ error: "Product type not found" })
      return
    }

    if (productType1.name === productType2.name) {
      res.status(400).json({ error: "Product types are the same" })
      return
    }

    // swap weights
    // this is required to avoid unique constraint violation
    await prisma.$transaction([
      prisma.productType.update({
        where: { name: productType1.name },
        data: { weight: null },
      }),
      prisma.productType.update({
        where: { name: productType2.name },
        data: { weight: productType1.weight },
      }),
      prisma.productType.update({
        where: { name: productType1.name },
        data: { weight: productType2.weight },
      }),
    ])

    res.status(200).end()
  })
