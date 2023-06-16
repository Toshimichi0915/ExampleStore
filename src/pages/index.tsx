import { TopPage } from "@/client/top/top.page"
import { getEnvironment, getProductTypes } from "@/server/db"
import { searchProducts } from "@/server/search.util"
import { SearchSchema } from "@/common/search.type"
import { z } from "zod"

export default TopPage

export async function getStaticProps() {
  const productTypes = await getProductTypes()
  const products = await searchProducts(SearchSchema.parse({} satisfies z.input<typeof SearchSchema>))

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
