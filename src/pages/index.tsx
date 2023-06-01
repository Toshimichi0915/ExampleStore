import { TopPage } from "@/client/top/top.page"
import { prisma } from "@/server/prisma.util"
import { productPrismaToObj, productTypePrismaToObj } from "@/server/mapper.util"
import { ChargeStatus } from "@/common/db.type"

export default TopPage

export async function getStaticProps() {
  const productTypes = (await prisma.productType.findMany()).map(productTypePrismaToObj)
  const products = (
    await prisma.product.findMany({
      where: {
        charges: { none: { status: ChargeStatus.RESOLVED } },
      },
    })
  ).map((product) => productPrismaToObj(product))

  return {
    props: {
      productTypes,
      products,
    },
    revalidate: 10,
  }
}
