import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"
import { ZodError } from "zod/lib"
import { prisma, productPrismaToObj } from "@/server/db"
import { getUserId } from "@/server/id"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api//auth/[...nextauth]"

export const SearchSchema = z.object({
  type: z.string(),
  skip: z.number().optional(),
  take: z.number().optional(),
})

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = getUserId(req, res)
  const session = await getServerSession(req, res, authOptions)

  if (req.method === "POST") {
    const result = SearchSchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ error: result.error as ZodError })
      return
    }

    const { type, skip, take } = result.data

    const response = (await prisma.product.findMany({
        where: {
          typeId: type,
        },
        include: {
          charges: { select: { userId: true, status: true } },
        },
        skip,
        take,
      })).map((product) => productPrismaToObj(product, userId, session))

    res.status(200).json(response)
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
