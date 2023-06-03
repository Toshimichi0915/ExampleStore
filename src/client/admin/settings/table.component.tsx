import { useCallback, useState } from "react"
import { ProductType, PurchasedProduct } from "@/common/db.type"
import { Button, Theme } from "@mui/material"
import { paperStyles } from "@/client/common/styles"
import { ProductTableRow, ProductTypeTableRow } from "@/client/admin/settings/row"
import { ProductEditDialog } from "@/client/admin/settings/dialog/product.component"
import { css } from "@emotion/react"
import { ProductTypeEditDialog } from "@/client/admin/settings/dialog/product-type.component"

export function SettingsProductTypes({ productTypes, className }: { productTypes: ProductType[]; className?: string }) {
  const [productTypeEditDialogOpen, setProductTypeEditDialogOpen] = useState(false)
  const openProductTypeEditDialog = useCallback(() => setProductTypeEditDialogOpen(true), [])
  const closeProductTypeEditDialog = useCallback(() => setProductTypeEditDialogOpen(false), [])

  return (
    <>
      <ProductTypeEditDialog
        open={productTypeEditDialogOpen}
        onClose={closeProductTypeEditDialog}
        productTypes={productTypes}
      />
      <section className={className} css={settingsTableStyles}>
        <div className="Settings-TableHeader">
          <h2 className="Settings-TableTitle">Product Types</h2>
          <Button className="Settings-AddButton" onClick={openProductTypeEditDialog}>
            Add new...
          </Button>
        </div>
        <div css={paperStyles}>
          {productTypes.length > 0 ? (
            <div className="Settings-TableBody">
              {productTypes.map((productType: ProductType) => (
                <ProductTypeTableRow key={productType.name} productType={productType} productTypes={productTypes} />
              ))}
            </div>
          ) : (
            <p className="Settings-Empty">Empty :(</p>
          )}
        </div>
      </section>
    </>
  )
}

export function SettingsProducts({
  products,
  productTypes,
  className,
}: {
  products: PurchasedProduct[]
  productTypes: ProductType[]
  className?: string
}) {
  const [productEditDialogOpen, setProductEditDialogOpen] = useState(false)
  const openProductEditDialog = useCallback(() => setProductEditDialogOpen(true), [])
  const closeProductEditDialog = useCallback(() => setProductEditDialogOpen(false), [])

  return (
    <>
      <ProductEditDialog open={productEditDialogOpen} onClose={closeProductEditDialog} productTypes={productTypes} />
      <section className={className} css={settingsTableStyles}>
        <div className="Settings-TableHeader">
          <h2 className="Settings-TableTitle">Products</h2>
          <Button className="Settings-AddButton" onClick={openProductEditDialog}>
            Add new...
          </Button>
        </div>
        <div css={paperStyles}>
          {products.length > 0 ? (
            <div className="Settings-TableBody">
              {products.map((product: PurchasedProduct) => (
                <ProductTableRow key={product.id} product={product} productTypes={productTypes} />
              ))}
            </div>
          ) : (
            <p className="Settings-Empty">Empty :(</p>
          )}
        </div>
      </section>
    </>
  )
}

function settingsTableStyles(theme: Theme) {
  return css`
    & .Settings-TableHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    & .Settings-TableTitle {
      margin: 8px 0;
    }

    & .Settings-AddButton {
      color: white;
      padding-left: 12px;
      padding-right: 12px;
      background-color: ${theme.palette.primary.dark};
    }

    & .Settings-TableBody {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    & .Settings-Empty {
      margin: 3px 0;
    }
  `
}
