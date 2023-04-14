import { Product } from "@/common/db.type"
import { css, Theme } from "@mui/material"
import { usePurchase } from "@/client/top/purchase.hook"
import { paperStyles } from "@/client/common/styles"

export function ProductItem({ product }: { product: Product }) {

  const { purchase } = usePurchase(product)

  return (
    <div css={[ paperStyles, productItemStyles ]}>
      <div>
        <p className="ProductType">{product.type}</p>
        <p className="ProductName">{product.name}</p>
      </div>
      <button className="PurchaseButton" onClick={purchase}>
        PURCHASE - ${product.price}
      </button>
    </div>
  )
}

export function productItemStyles(theme: Theme) {
  return css`
    padding: 20px;
    border-radius: 6px;
    border: 1px solid ${theme.palette.border.paper};
    background-color: ${theme.palette.background.paper};

    & .ProductType {
      margin: 0;
      font-size: 0.9rem;
    }

    & .ProductName {
      margin: 8px 0 24px 0;
      font-size: 1.1rem;
    }

    & .PurchaseButton {
      outline: none;
      width: 100%;
      border: 2px solid ${theme.palette.primary.main};
      color: ${theme.palette.primary.main};
      background-color: transparent;
      font-family: ${theme.typography.fontFamily};
      font-size: 0.9rem;
      padding: 4px 0;
      border-radius: 6px;
      transition: all 0.3s ease-in-out;

      &:hover {
        background-color: white;
        border-color: black;
        color: black;
        cursor: pointer;
      }
    }
  `
}
