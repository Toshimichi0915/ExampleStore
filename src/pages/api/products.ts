import { NextApiRequest, NextApiResponse } from "next"
import { isAdmin, prisma, productPrismaToObj, purchasedProductPrismaToObj } from "@/server/db"
import { ProductSchema } from "@/common/product"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (req.method === "GET") {
    const products = await prisma.product.findMany({
      include: {
        charges: { select: { userId: true, status: true } },
      },
    })

    const details = req.query.details === "true"
    if (details) {
      if (!session) {
        res.status(401).json({ error: "Unauthorized" })
        return
      }

      if (!isAdmin(session)) {
        res.status(403).json({ error: "Forbidden" })
        return
      }

      res.status(200).json(products.map((product) => purchasedProductPrismaToObj(product)))
      return
    } else {
      res.status(200).json(products.map((product) => productPrismaToObj(product)))
      return
    }
  } else if (req.method === "POST") {
    if (!session) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

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

    res.status(200).json(purchasedProductPrismaToObj(product))
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
