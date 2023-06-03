import { TopPage } from "@/client/top/top.page"
import { prisma } from "@/server/global.type"
import { productPrismaToObj } from "@/server/mapper.util"
import { ChargeStatus } from "@/common/db.type"
import { getEnvironment, getProductTypes } from "@/server/db"

export default TopPage

export async function getStaticProps() {
  const productTypes = await getProductTypes()
  const products = (
    await prisma.product.findMany({
      where: {
        charges: { none: { status: ChargeStatus.RESOLVED } },
      },
      orderBy: {
        price: "desc",
      },
    })
  ).map((product) => productPrismaToObj(product))

  const environment = await getEnvironment()

  return {
    props: {
      productTypes,
      products,
      environment,
    },
    revalidate: 10,
  }
}
