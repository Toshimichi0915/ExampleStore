import { Product } from "@/common/db.type"
import { css } from "@mui/material"
import { ProductItem } from "@/client/top/item.component"

export function Main({ products }: { products: Product[] }) {
  return (
    <main css={mainStyles}>
      <div className="Main-Products">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}

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
    }
  `
}
