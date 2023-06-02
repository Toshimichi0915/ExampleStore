import { middleware, suppress, withMethods, withValidatedBody } from "next-pipe"
import { NextApiRequest, NextApiResponse } from "next"
import { getEnvironment } from "@/server/environment"
import { withAdminSession } from "@/server/session.util"
import { z } from "zod"
import { prisma } from "@/server/prisma.util"

const EnvironmentSchema = z.object({
  telegramUrl: z.string(),
  termsOfService: z.object({}).optional(),
})

export default middleware<NextApiRequest, NextApiResponse>().pipe(
  withMethods(({ get, put }) => {
    get().pipe(async (req, res) => {
      res.json(await getEnvironment())
    })

    put()
      .pipe(suppress(withAdminSession()), withValidatedBody(EnvironmentSchema))
      .pipe(async (req, res, next, body) => {
        await prisma.environment.upsert({
          where: { id: "_" },
          update: body,
          create: body,
        })
        res.status(200).end()
      })
  })
)
