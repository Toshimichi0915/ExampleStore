import { getUserId } from "@/server/id"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = getUserId(req, res)

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  if (req.method === "GET") {
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
