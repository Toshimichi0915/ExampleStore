import { ProductType } from "@/common/db.type"
import { Button, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material"
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react"
import { dialogStyles } from "@/client/common/styles"
import { useProductTypeEdit } from "@/client/admin/settings/dialog/product-type.hook"

export function ProductTypeEditDialog({ className, open, onClose, productType }: {
  className?: string,
  open: boolean
  onClose: () => void
  productType?: ProductType
}) {

  const initialProductTypeBody = useMemo(() => ({
    name: productType?.name ?? "",
  }), [ productType ])

  const [ productTypeBody, setProductTypeBody ] = useState(initialProductTypeBody)
  useEffect(() => {
    setProductTypeBody(initialProductTypeBody)
  }, [ initialProductTypeBody ])

  const setName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setProductTypeBody((prev) => ({ ...prev, name: e.target.value }))
  }, [ setProductTypeBody ])

  const productTypeEdit = useProductTypeEdit(productType)

  const submit = useCallback(() => {
    productTypeEdit.edit(productTypeBody)
    onClose()
  }, [ onClose, productTypeBody, productTypeEdit ])

  return (
    <Dialog
      css={dialogStyles}
      className={className}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Edit Product Type</DialogTitle>
      <DialogContent>
        <TextField label="name" size="small" value={productTypeBody.name} onChange={setName} />
        <Button onClick={submit}>OK</Button>
      </DialogContent>
    </Dialog>
  )
}
