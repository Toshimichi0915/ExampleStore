import { NextApiRequest, NextApiResponse } from "next"
import { getUserId } from "@/server/session/id.util"
import { prisma } from "@/server/prisma.util"
import { chargePrismaToObj } from "@/server/mapper.util"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    const charge = await prisma.charge.findUnique({
      where: { id },
      include: { product: true },
    })

    if (!charge) {
      res.status(404).json({ error: "Charge not found" })
      return
    }

    return res.status(200).json(chargePrismaToObj(charge, charge.product))

  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
