import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"
import { ZodError } from "zod/lib"
import { prisma, productPrismaToObj } from "@/server/db"

export const SearchSchema = z.object({
  type: z.string(),
  skip: z.number().optional(),
  take: z.number().optional(),
})

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const result = SearchSchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ error: result.error as ZodError })
      return
    }

    const { type, skip, take } = result.data

    const response = (
      await prisma.product.findMany({
        where: {
          typeId: type,
        },
        skip,
        take,
      })
    ).map((product) => productPrismaToObj(product))

    res.status(200).json(response)
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
