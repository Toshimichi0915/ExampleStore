import { SettingsPage } from "@/client/admin/settings/settings.page"
import { prisma } from "@/server/prisma.util"
import { purchasedProductPrismaToObj } from "@/server/mapper.util"
import { getEnvironment, getProductTypes } from "@/server/db"

export default SettingsPage

export async function getServerSideProps() {
  const products = (
    await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    })
  ).map(purchasedProductPrismaToObj)

  const productTypes = await getProductTypes()
  const environment = await getEnvironment()

  return {
    props: {
      products,
      productTypes,
      environment,
    },
  }
}
