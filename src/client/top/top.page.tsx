import { useProducts } from "@/client/common/products.hook"
import { Header } from "@/client/top/header.component"
import { Main } from "@/client/top/main.component"
import { css } from "@emotion/react"
import { InferGetStaticPropsType } from "next"
import { getStaticProps } from "@/pages"

export function TopPage({ products: initialProducts }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { products } = useProducts(initialProducts)

  return (
    <div css={topPageStyles}>
      <Header />
      <Main products={products} />
    </div>
  )
}

function topPageStyles() {
  return css`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  `
}
