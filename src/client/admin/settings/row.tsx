import { ReactNode, useCallback, useState } from "react"
import { Button } from "@mui/material"
import { css } from "@emotion/react"
import { ProductType, PurchasedProduct } from "@/common/db.type"
import { ProductEditDialog } from "@/client/admin/settings/dialog/product.component"
import { useProductEdit } from "@/client/admin/settings/dialog/product.hook"
import { ProductTypeEditDialog } from "@/client/admin/settings/dialog/product-type.component"
import { useProductTypeEdit } from "@/client/admin/settings/dialog/product-type.hook"

export function TableRow({ className, children, onEdit, onDelete }: {
  className?: string,
  children: ReactNode
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div css={tableRowStyles}>
      <p className="ColumnName">{children}</p>
      <div className="Buttons">
        <Button onClick={onEdit}>EDIT</Button>
        <Button onClick={onDelete}>Delete</Button>
      </div>
    </div>
  )
}

export function ProductTableRow({ className, product, productTypes }: {
  className?: string,
  product: PurchasedProduct,
  productTypes: ProductType[]
}) {

  const [ open, setOpen ] = useState(false)
  const { remove } = useProductEdit(product)

  const openDialog = useCallback(() => {
    setOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <>
      <ProductEditDialog open={open} onClose={closeDialog} product={product} productTypes={productTypes} />
      <TableRow onEdit={openDialog} onDelete={remove}>
        ${product.price} - {product.name}
      </TableRow>
    </>
  )
}

export function ProductTypeTableRow({ className, productType }: { className?: string, productType: ProductType }) {

  const [ open, setOpen ] = useState(false)
  const { remove } = useProductTypeEdit(productType)

  const openDialog = useCallback(() => {
    setOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <>
      <ProductTypeEditDialog open={open} onClose={closeDialog} productType={productType} />
      <TableRow onEdit={openDialog} onDelete={remove} className={className}>
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

    & .ColumnName {
      margin-top: 0;
      margin-bottom: 0;
    }

    & .Buttons {
      display: flex;
    }
  `
}
