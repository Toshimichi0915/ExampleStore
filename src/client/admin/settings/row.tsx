import { ReactNode, useCallback, useMemo, useState } from "react"
import { Button } from "@mui/material"
import { css } from "@emotion/react"
import { ProductType, PurchasedProduct } from "@/common/db.type"
import { ProductEditDialog } from "@/client/admin/settings/dialog/product.component"
import { useProductEdit } from "@/client/admin/settings/dialog/product.hook"
import { ProductTypeEditDialog } from "@/client/admin/settings/dialog/product-type.component"
import { useProductTypeEdit } from "@/client/admin/settings/dialog/product-type.hook"

export interface TableButton {
  name: string

  onClick(): void
}

export function TableRow({
  className,
  children,
  buttons,
}: {
  className?: string
  children: ReactNode
  buttons: TableButton[]
}) {
  return (
    <div css={tableRowStyles} className={className}>
      <p className="TableRow-ColumnName">{children}</p>
      <div className="TableRow-Buttons">
        {buttons.map((button) => (
          <Button key={button.name} onClick={button.onClick}>
            {button.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

export function ProductTableRow({
  className,
  product,
  productTypes,
}: {
  className?: string
  product: PurchasedProduct
  productTypes: ProductType[]
}) {
  const [open, setOpen] = useState(false)
  const { remove } = useProductEdit(product)

  const openDialog = useCallback(() => setOpen(true), [])
  const closeDialog = useCallback(() => setOpen(false), [])

  const buttons = useMemo(
    () => [
      { name: "Edit", onClick: openDialog },
      { name: "Delete", onClick: remove },
    ],
    [openDialog, remove]
  )

  return (
    <>
      <ProductEditDialog open={open} onClose={closeDialog} product={product} productTypes={productTypes} />
      <TableRow className={className} buttons={buttons}>
        ${product.price} - {product.name}
      </TableRow>
    </>
  )
}

export function ProductTypeTableRow({
  className,
  productType,
  productTypes,
}: {
  className?: string
  productType: ProductType
  productTypes: ProductType[]
}) {
  const [open, setOpen] = useState(false)
  const { moveUp, moveDown, remove } = useProductTypeEdit(productTypes, productType)

  const openDialog = useCallback(() => setOpen(true), [])
  const closeDialog = useCallback(() => setOpen(false), [])

  const buttons = useMemo(
    () => [
      { name: "Edit", onClick: openDialog },
      { name: "Delete", onClick: remove },
      { name: "Up", onClick: moveUp },
      { name: "Down", onClick: moveDown },
    ],
    [moveDown, moveUp, openDialog, remove]
  )

  return (
    <>
      <ProductTypeEditDialog open={open} onClose={closeDialog} productType={productType} productTypes={productTypes} />
      <TableRow className={className} buttons={buttons}>
        {productType.name}
      </TableRow>
    </>
  )
}

function tableRowStyles() {
  return css`
    display: flex;
    justify-content: space-between;
    align-items: center;

    & .TableRow-ColumnName {
      margin-top: 0;
      margin-bottom: 0;
    }

    & .TableRow-Buttons {
      display: flex;
    }
  `
}
