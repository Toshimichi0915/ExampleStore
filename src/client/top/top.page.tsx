import { Header } from "@/client/top/header.component"
import { Main } from "@/client/top/main.component"
import { css } from "@emotion/react"
import { InferGetStaticPropsType } from "next"
import { getStaticProps } from "@/pages"
import { Search } from "@/client/top/search/search.component"
import { memo } from "react"
import { Footer } from "@/client/top/footer.component"

export const TopPage = memo(function TopPage({
  products: initialProducts,
  productTypes: initialProductTypes,
  environment: initialEnvironment,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div css={topPageStyles}>
      <Header environment={initialEnvironment} />
      <Search productTypes={initialProductTypes} />
      <Main products={initialProducts} environment={initialEnvironment} />
      <Footer />
    </div>
  )
})

function topPageStyles() {
  return css`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  `
}
