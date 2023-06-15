import { Environment, Product } from "@/common/db.type"
import { css, Theme } from "@mui/material"
import { paperStyles } from "@/client/common/styles"
import { ProductDialog } from "@/client/top/product-dialog.component"
import { memo, useCallback, useState } from "react"

export const ProductItem = memo(function ProductItem({
  product,
  environment,
}: {
  product: Product
  environment: Environment
}) {
  const [open, setOpen] = useState(false)
  const openDialog = useCallback(() => setOpen(true), [])
  const onClose = useCallback(() => setOpen(false), [])

  return (
    <>
      <ProductDialog product={product} open={open} onClose={onClose} environment={environment} />
      <div css={[paperStyles, productItemStyles]}>
        <div>
          <p className="ProductItem-ProductType">{product.type}</p>
          <p className="ProductItem-ProductName">{product.name}</p>
        </div>
        <button className="ProductItem-PurchaseButton" onClick={openDialog}>
          PURCHASE - ${product.price}
        </button>
      </div>
    </>
  )
})

export function productItemStyles(theme: Theme) {
  return css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    border-radius: 6px;
    border: 1px solid ${theme.palette.border.paper};

    & .ProductItem-ProductType {
      margin: 0;
      font-size: 0.9rem;
    }

    & .ProductItem-ProductName {
      margin: 8px 0 24px 0;
      font-size: 1.1rem;
    }

    & .ProductItem-PurchaseButton {
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
