import { Product as PrismaProduct } from "@prisma/client"
import { Session } from "next-auth"
import { ChargeStatus, Product } from "@/common/db.type"
import { prisma } from "@/server/global.type"
import { IncomingMessage, ServerResponse } from "http"
import { getIronSession, IronSessionOptions } from "iron-session"
import crypto from "crypto"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { NextApiRequestCookies } from "next/dist/server/api-utils"
import { Middleware } from "next-pipe"
import { NextApiRequest, NextApiResponse } from "next"

const ironPassword = process.env.IRON_PASSWORD
if (!ironPassword) {
  throw new Error("IRON_PASSWORD not set")
}

declare module "iron-session" {
  export interface IronSession {
    data?: {
      uid: string
    }

    // original methods
    destroy: () => void
    save: () => Promise<void>
  }
}

export const ironOptions: IronSessionOptions = {
  cookieName: "CH_IRON",
  password: ironPassword,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}

type GetUserIdReturnType<T extends boolean> = T extends true ? string : string | undefined

export async function getUserId<T extends boolean>(
  req: IncomingMessage,
  res: ServerResponse,
  init?: T
): Promise<GetUserIdReturnType<T>> {
  const session = await getIronSession(req, res, ironOptions)
  if (session.data) {
    return session.data.uid
  } else {
    if (init) {
      const uid = crypto.randomUUID()
      session.data = { uid }
      await session.save()

      return uid
    }
    return undefined as GetUserIdReturnType<T>
  }
}

export function withUserId<T extends boolean>(
  init: T
): Middleware<IncomingMessage, ServerResponse, [], [GetUserIdReturnType<T>]> {
  return async (req, res, next) => {
    const userId = await getUserId(req, res, init)
    await next(userId as GetUserIdReturnType<T>)
  }
}

export async function isProductAvailable(
  product: string | PrismaProduct | Product,
  req: IncomingMessage & { cookies: NextApiRequestCookies },
  res: ServerResponse
): Promise<boolean> {
  const session = await getServerSession(req, res, authOptions)
  if (session && isAdmin(session)) return true

  const userId = await getUserId(req, res)
  if (!userId) return false

  let productId
  if (typeof product === "string") {
    productId = product
  } else {
    productId = product.id
  }

  const charge = await prisma.charge.findFirst({
    where: {
      productId: productId,
      userId: userId,
      status: ChargeStatus.RESOLVED,
    },
  })

  return !!charge
}

export function isAdmin(session: Session): boolean {
  return session.user.roles.includes("ADMIN")
}

export function withAdminSession(): Middleware<NextApiRequest, NextApiResponse, [], [Session]> {
  return async (req, res, next) => {
    const session = await getServerSession(req, res, authOptions)
    if (session && isAdmin(session)) {
      await next(session)
    } else {
      res.status(401).json({ error: "Unauthorized" })
    }
  }
}
