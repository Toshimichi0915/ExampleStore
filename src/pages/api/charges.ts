import { getUserId } from "@/server/id"
import { NextApiRequest, NextApiResponse } from "next"
import { chargePrismaToObj, prisma } from "@/server/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = getUserId(req, res)

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  if (req.method === "GET") {
    res.status(200).json(
      (
        await prisma.charge.findMany({
          where: { userId },
          include: { product: true },
        })
      ).map((charge) => chargePrismaToObj(charge, charge.product))
    )
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
