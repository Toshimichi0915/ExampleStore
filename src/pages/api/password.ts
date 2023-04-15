import { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"
import { PasswordSchema } from "@/common/password.type"
import { prisma } from "@/server/prisma.util"
import bcrypt from "bcrypt"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  })

  if (!user) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  if (req.method === "POST") {

    const schema = PasswordSchema.safeParse(req.body)
    if (!schema.success) {
      res.status(400).json({ error: "Invalid data" })
      return
    }

    const { oldPassword, newPassword } = schema.data
    if (!await bcrypt.compare(oldPassword, user.password)) {
      res.status(400).json({ error: "Invalid password" })
      return
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    res.status(200).json({ message: "Password changed" })

  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
