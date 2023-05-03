import { NextApiRequest, NextApiResponse } from "next"
import { chargePrismaToObj } from "@/server/mapper.util"
import { prisma } from "@/server/prisma.util"
import { getUserId } from "@/server/session.util"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getUserId(req, res)

  if (!userId) {
    res.status(200).json([])
    return
  }

  if (req.method === "GET") {
    res.status(200).json(
      (
        await prisma.charge.findMany({
          where: { userId },
          include: { product: true },
        })
      ).map((charge) => chargePrismaToObj(charge, charge.product)),
    )
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
