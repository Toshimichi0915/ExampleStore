import { Environment } from "@/common/db.type"
import { prisma } from "@/server/prisma.util"

export async function getEnvironment(): Promise<Environment> {
  const settings = await prisma.environment.upsert({
    where: { id: "_" },
    update: {},
    create: {},
  })

  // tiptap only accepts object
  const termsOfService = settings.termsOfService as object | undefined

  return {
    telegramUrl: settings.telegramUrl,
    ...(termsOfService && { termsOfService }),
  }
}
