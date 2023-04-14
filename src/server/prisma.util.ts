import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const client = globalThis.prisma || new PrismaClient()
export const prisma = client
