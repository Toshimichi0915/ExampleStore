import { NextApiRequest, NextApiResponse } from "next"
import { isAdmin } from "@/server/session.util"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"
import { productTypePrismaToObj } from "@/server/mapper.util"
import { prisma } from "@/server/prisma.util"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (req.method === "GET") {
    const productTypes = (await prisma.productType.findMany({
      orderBy: { createdAt: "desc" },
    })).map(productTypePrismaToObj)

    res.status(200).json(productTypes)
  } else if (req.method === "POST") {

    if (!session) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    if (!isAdmin(session)) {
      res.status(403).json({ error: "Forbidden" })
      return
    }

    const { name } = req.body
    if (typeof name !== "string") {
      res.status(400).json({ error: "Invalid name" })
      return
    }

    const productType = await prisma.productType.create({
      data: { name },
    })

    res.status(200).json(productTypePrismaToObj(productType))
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
