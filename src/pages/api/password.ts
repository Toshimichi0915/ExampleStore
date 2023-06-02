import { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { PasswordSchema } from "@/common/password.type"
import { prisma } from "@/server/prisma.util"
import bcrypt from "bcrypt"
import { middleware, withMethods, withServerSession, withValidatedBody } from "next-pipe"

export default middleware<NextApiRequest, NextApiResponse>()
  .pipe(withServerSession(authOptions, true), withValidatedBody(PasswordSchema))
  .pipe(
    withMethods(({ post }) => {
      post().pipe(async (req, res, next, session, schema) => {
        const user = await prisma.user.findUnique({
          where: {
            id: session.user.id,
          },
        })

        if (!user) {
          res.status(401).json({ error: "Unauthorized" })
          return
        }

        const { oldPassword, newPassword } = schema
        if (!(await bcrypt.compare(oldPassword, user.password))) {
          res.status(400).json({ error: "Invalid password" })
          return
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        })

        res.status(200).json({ message: "Password changed" })
      })
    })
  )
