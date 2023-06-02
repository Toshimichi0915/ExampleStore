import { SettingsPage } from "@/client/admin/settings/settings.page"
import { prisma } from "@/server/prisma.util"
import { productTypePrismaToObj, purchasedProductPrismaToObj } from "@/server/mapper.util"

export default SettingsPage

export async function getServerSideProps() {
  const products = (
    await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    })
  ).map(purchasedProductPrismaToObj)
  const productTypes = (
    await prisma.productType.findMany({
      orderBy: { createdAt: "desc" },
    })
  ).map(productTypePrismaToObj)
  return {
    props: {
      products,
      productTypes,
    },
  }
}
