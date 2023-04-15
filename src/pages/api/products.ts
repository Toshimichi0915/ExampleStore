import { NextApiRequest, NextApiResponse } from "next"
import { isAdmin } from "@/server/session/session.util"
import { PurchasedProductSchema } from "@/common/product.type"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"
import { purchasedProductPrismaToObj } from "@/server/mapper.util"
import { prisma } from "@/server/prisma.util"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  if (!isAdmin(session)) {
    res.status(403).json({ error: "Forbidden" })
    return
  }

  if (req.method === "GET") {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    })

    res.status(200).json(products.map(purchasedProductPrismaToObj))
  } else if (req.method === "POST") {
    const schema = PurchasedProductSchema.safeParse(req.body)
    if (!schema.success) {
      res.status(400).json({ error: "Invalid data" })
      return
    }

    const { name, type: typeId, price, content } = schema.data
    const product = await prisma.product.create({
      data: { name, typeId, price, content },
    })

    res.status(200).json(purchasedProductPrismaToObj(product))
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
