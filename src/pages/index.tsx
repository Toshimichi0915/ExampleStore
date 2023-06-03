import { TopPage } from "@/client/top/top.page"
import { prisma } from "@/server/prisma.util"
import { productPrismaToObj, productTypePrismaToObj } from "@/server/mapper.util"
import { ChargeStatus } from "@/common/db.type"
import { getEnvironment } from "@/server/environment"

export default TopPage

export async function getStaticProps() {
  const productTypes = (await prisma.productType.findMany()).map(productTypePrismaToObj)
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
