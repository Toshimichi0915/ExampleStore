import { NextApiRequest, NextApiResponse } from "next"
import { isAdmin, isProductAvailable, prisma, productPrismaToObj } from "@/server/db"
import { ProductSchema } from "@/common/product"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
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

    res.status(200).json(productPrismaToObj(product, await isProductAvailable(product, session)))
  } else if (req.method === "PUT") {
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
