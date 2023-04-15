import { NextApiRequest, NextApiResponse } from "next"
import { isAdmin, isProductAvailable } from "@/server/session/session.util"
import { PurchasedProductSchema } from "@/common/product.type.ts"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { getUserId } from "@/server/session/id.util"
import { purchasedProductPrismaToObj } from "@/server/mapper.util"
import { prisma } from "@/server/prisma.util"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  const userId = getUserId(req, res)
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  const { id } = req.query

  if (typeof id !== "string") {
    res.status(400).json({ error: "Invalid id" })
    return
  }

  if (req.method === "GET") {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    })

    if (!product) {
      res.status(404).json({ error: "Product not found" })
      return
    }

    if (!(await isProductAvailable(product, userId, session))) {
      res.status(403).json({ error: "Forbidden" })
      return
    }

    res.status(200).json(purchasedProductPrismaToObj(product))
  } else if (req.method === "PUT") {

    if (!session) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    if (!isAdmin(session)) {
      res.status(403).json({ error: "Forbidden" })
      return
    }

    const schema = PurchasedProductSchema.safeParse(req.body)
    if (!schema.success) {
      res.status(400).json({ error: "Invalid data" })
      return
    }

    const { name, type: typeId, price, content } = schema.data
    const product = await prisma.product.update({
      where: { id },
      data: { name, typeId, price, content },
    })

    if (!product) {
      res.status(404).json({ error: "Product not found" })
      return
    }

    res.status(200).end()
  } else if (req.method === "DELETE") {

    if (!session) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    if (!isAdmin(session)) {
      res.status(403).json({ error: "Forbidden" })
      return
    }

    const deleted = await prisma.product.delete({
      where: {
        id,
      },
    })

    if (!deleted) {
      res.status(404).json({ error: "Product not found" })
      return
    }

    res.status(200).end()
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
