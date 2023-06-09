import { Button, Dialog, DialogContent, DialogTitle, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import {
  Charge,
  ChargeStatus,
  ChargeStatusKeys,
  ChargeStatusNames,
  ProductType,
  PurchasedProduct,
} from "@/common/db.type"
import { dialogStyles } from "@/client/common/styles"
import { css } from "@emotion/react"
import { useCallback, useState } from "react"
import { ProductEditDialog } from "@/client/admin/settings/dialog/product.component"
import { useChargeEdit } from "@/client/admin/settings/dialog/charge.hook"

export function ChargeEditDialog({
  className,
  open,
  onClose,
  charge,
  product,
  productTypes,
}: {
  className?: string
  open: boolean
  onClose: () => void
  charge: Charge
  product: PurchasedProduct
  productTypes: ProductType[]
}) {
  const [productEditDialogOpen, setProductEditDialogOpen] = useState(false)
  const onProductEditDialogOpen = useCallback(() => setProductEditDialogOpen(true), [])
  const onProductEditDialogClose = useCallback(() => setProductEditDialogOpen(false), [])

  const { edit } = useChargeEdit(charge)

  const [status, setStatus] = useState(charge.status)
  const changeStatus = useCallback((e: SelectChangeEvent) => {
    setStatus(e.target.value as ChargeStatus)
  }, [])

  const onSubmit = useCallback(() => {
    edit({ status })
    onClose()
  }, [edit, status, onClose])

  return (
    <>
      <ProductEditDialog
        open={productEditDialogOpen}
        onClose={onProductEditDialogClose}
        productTypes={productTypes}
        product={product}
      />
      <Dialog open={open} onClose={onClose} css={[dialogStyles, chargeEditDialogStyles]} className={className}>
        <DialogTitle>Edit Charge</DialogTitle>
        <DialogContent>
          <div className="ChargeDialog-Id">
            <p className="ChargeDialog-IdLabel">Charge ID</p>
            <p className="ChargeDialog-IdValue">{charge.id}</p>
          </div>
          <Select className="ChargeDialog-Type" value={status} onChange={changeStatus}>
            {ChargeStatusKeys.map((key: ChargeStatus) => (
              <MenuItem key={key} value={key}>
                {ChargeStatusNames[key]}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={onProductEditDialogOpen}>Click to edit product</Button>
          <Button onClick={onSubmit}>OK</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

function chargeEditDialogStyles() {
  return css`
    & .ChargeDialog-Id {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    & .ChargeDialog-IdLabel {
      margin: 2px 0;
    }

    & .ChargeDialog-IdValue {
      margin: 2px 0;
    }
  `
}
