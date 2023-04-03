import { NextApiRequest, NextApiResponse } from "next"
import { isAdmin, prisma, productTypePrismaToObj } from "@/server/db"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  const { name } = req.query
  if (typeof name !== "string") {
    res.status(400).json({ error: "Invalid id" })
    return
  }

  if (req.method === "GET") {
    const productType = await prisma.productType.findUnique({
      where: { name },
    })

    if (!productType) {
      res.status(404).json({ error: "Product type not found" })
      return
    }

    res.status(200).json(productTypePrismaToObj(productType))
  } else if (req.method === "PUT") {
    if (!isAdmin(session)) {
      res.status(403).json({ error: "Forbidden" })
      return
    }
    const { name: newName } = req.body
    if (typeof newName !== "string") {
      res.status(400).json({ error: "Invalid name" })
      return
    }

    const existingProductType = await prisma.productType.findUnique({
      where: { name: newName },
    })

    if (existingProductType) {
      await prisma.$transaction([
        prisma.product.updateMany({ where: { typeId: name }, data: { typeId: newName } }),
        prisma.productType.delete({ where: { name } }),
      ])
    } else {
      const productType = await prisma.productType.update({
        where: { name },
        data: { name: newName },
      })

      if (!productType) {
        res.status(404).json({ error: "Product type not found" })
        return
      }
    }

    res.status(200).end()
  } else if (req.method === "DELETE") {
    if (!isAdmin(session)) {
      res.status(403).json({ error: "Forbidden" })
      return
    }
    const [, deleted] = await prisma.$transaction([
      prisma.product.updateMany({
        where: { typeId: name },
        data: { typeId: undefined },
      }),
      prisma.productType.delete({ where: { name } }),
    ])

    if (!deleted) {
      res.status(404).json({ error: "Product type not found" })
      return
    }
    res.status(200).end()
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
