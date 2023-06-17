import { Environment, Product } from "@/common/db.type"
import { css } from "@mui/material"
import { ProductItem } from "@/client/top/item.component"
import { memo } from "react"
import { useSearch } from "@/client/top/search.hook"
import InfiniteScroll from "react-infinite-scroll-component"

export const Main = memo(function Main({
  products: initialProducts,
  environment,
}: {
  products: Product[]
  environment: Environment
}) {
  const { data, hasMore, fetchMore } = useSearch(initialProducts)

  return (
    <main css={mainStyles}>
      <InfiniteScroll
        next={fetchMore}
        hasMore={hasMore}
        loader="Loading..."
        dataLength={data.length}
        className="Main-Products"
      >
        {data.map((product) => (
          <ProductItem key={product.id} product={product} environment={environment} />
        ))}
      </InfiniteScroll>
    </main>
  )
})

function mainStyles() {
  return css`
    flex: 1;
    padding: 0 30px;
    margin-bottom: 30px;

    @media (min-width: 768px) {
      padding: 0 100px;
    }
    @media (min-width: 1024px) {
      padding: 0 200px;
    }

    @media (min-width: 1280px) {
      padding: 0 calc((100vw - 1024px) / 2);
    }

    & .Main-Products {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      overflow: hidden;
    }
  `
}
