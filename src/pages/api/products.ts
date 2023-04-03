import { NextApiRequest, NextApiResponse } from "next"
import { isAdmin, prisma, productPrismaToObj } from "@/server/db"
import { ProductSchema } from "@/common/product"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"
import { getUserId } from "@/server/id"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = getUserId(req, res)
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  if (req.method === "GET") {
    const products = (
      await prisma.product.findMany({
        include: {
          charges: { select: { userId: true, status: true } },
        },
      })
    ).map((product) => productPrismaToObj(product, userId, session))

    res.status(200).json(products)
  } else if (req.method === "POST") {
    if (!isAdmin(session)) {
      res.status(403).json({ error: "Forbidden" })
      return
    }

    const schema = ProductSchema.safeParse(req.body)
    if (!schema.success) {
      res.status(400).json({ error: "Invalid data" })
      return
    }

    const { name, type: typeId, price, content } = schema.data
    const product = await prisma.product.create({
      data: { name, typeId, price, content },
      include: {
        charges: { select: { userId: true, status: true } },
      },
    })

    res.status(200).json(productPrismaToObj(product, userId, session))
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
