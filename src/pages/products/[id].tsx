import { GetServerSidePropsContext } from "next"
import { prisma } from "@/server/global.type"
import { getEnvironment, getProductTypes } from "@/server/db"
import { searchProducts } from "@/server/search.util"
import { SearchSchema } from "@/common/search.type"
import { z } from "zod"
import { productPrismaToObj } from "@/server/mapper.util"
import { TopPage } from "@/client/top/top.page"

export default TopPage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query

  if (typeof id !== "string") {
    return {
      notFound: true,
    }
  }

  const prismaProduct = await prisma.product.findUnique({ where: { id } })

  if (!prismaProduct) {
    return {
      notFound: true,
    }
  }

  const selectedProduct = productPrismaToObj(prismaProduct)

  const productTypes = await getProductTypes()
  const products = await searchProducts(SearchSchema.parse({} satisfies z.input<typeof SearchSchema>))
  const environment = await getEnvironment()

  return {
    props: {
      productTypes,
      products,
      environment,
      selectedProduct,
    },
  }
}
