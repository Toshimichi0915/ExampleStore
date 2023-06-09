import { Environment, ProductType } from "@/common/db.type"
import { prisma } from "@/server/global.type"
import { productTypePrismaToObj } from "@/server/mapper.util"

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
    channelUrl: settings.channelUrl,
    mailTo: settings.mailTo,
    campaign: settings.campaign,
    termsOfService,
  }
}

export async function getProductTypes(): Promise<ProductType[]> {
  return (
    await prisma.productType.findMany({
      orderBy: { weight: "asc" },
    })
  ).map(productTypePrismaToObj)
}
