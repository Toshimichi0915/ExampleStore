import { createCharge } from "@/server/coinbase.util"
import { getUserId } from "@/server/session/id.util"
import { NextApiRequest, NextApiResponse } from "next"

import { prisma } from "@/server/prisma.util"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (typeof id !== "string") {
    res.status(400).json({ error: "Invalid id" })
    return
  }

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  })

  if (!product) {
    res.status(404).json({ error: "Product not found" })
    return
  }

  const existingCharge = await prisma.charge.findFirst({
    where: {
      productId: product.id,
    },
  })

  if (existingCharge) {
    res.status(409).json({ error: "Product already purchased" })
    return
  }

  const userId = getUserId(req, res)

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  if (req.method === "POST") {
    res.status(200).json(await createCharge(product, userId))
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
