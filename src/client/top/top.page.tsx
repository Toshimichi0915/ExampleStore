import { Header } from "@/client/top/header.component"
import { Main } from "@/client/top/main.component"
import { css } from "@emotion/react"
import { InferGetStaticPropsType } from "next"
import { getStaticProps } from "@/pages"
import { useSearch } from "@/client/top/search.hook"
import { useSearchInputStore } from "@/client/top/search-input.store"
import { Search } from "@/client/top/search/search.component"
import { memo, useMemo } from "react"
import { SearchInput } from "@/common/search.type"
import { Footer } from "@/client/top/footer.component"

export const TopPage = memo(function TopPage({
  products: initialProducts,
  productTypes: initialProductTypes,
  environment: initialEnvironment,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [query, types, sort] = useSearchInputStore((state) => [state.query, state.types, state.sort])

  const searchInput: SearchInput = useMemo(() => ({ query, types, sort }), [query, types, sort])
  const products = useSearch(searchInput, initialProducts)

  return (
    <div css={topPageStyles}>
      <Header environment={initialEnvironment} />
      <Search productTypes={initialProductTypes} />
      <Main products={products} environment={initialEnvironment} />
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
