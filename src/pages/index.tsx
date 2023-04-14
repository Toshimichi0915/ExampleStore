import { TopPage } from "@/client/top/top.page"
import { prisma } from "@/server/prisma.util"
import { productPrismaToObj, productTypePrismaToObj } from "@/server/mapper.util"

export default TopPage

export async function getStaticProps() {
  const productTypes = (await prisma.productType.findMany()).map(productTypePrismaToObj)
  const products = (
    await prisma.product.findMany({
      where: {
        charges: {
          none: {
            NOT: { status: "FAILED" },
          },
        },
      },
    })
  ).map((product) => productPrismaToObj(product))

  return {
    props: {
      productTypes,
      products,
    },
  }
}
