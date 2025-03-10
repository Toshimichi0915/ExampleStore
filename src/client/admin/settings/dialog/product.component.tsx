import { ProductType, PurchasedProduct } from "@/common/db.type"
import { ChangeEvent, memo, useCallback, useEffect, useMemo, useState } from "react"
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  TextField,
} from "@mui/material"
import { dialogStyles, textAreaStyles } from "@/client/common/styles"
import { css } from "@emotion/react"
import { useProductEdit } from "@/client/admin/settings/dialog/product.hook"

export const ProductEditDialog = memo(function ProductEditDialog({
  className,
  open,
  onClose,
  product,
  productTypes,
}: {
  className?: string
  open: boolean
  onClose: () => void
  product?: PurchasedProduct
  productTypes: ProductType[]
}) {
  const initialProductBody = useMemo(
    () => ({
      name: product?.name ?? "",
      type: (product?.type && productTypes.find((t) => t.name == product?.type)?.name) ?? "",
      price: product?.price.toString() ?? "",
      content: product?.content ?? "",
      unswappable: product?.unswappable ?? false,
      hasOriginalMail: product?.hasOriginalMail ?? false,
      note: product?.note ?? "",
    }),
    [product, productTypes]
  )

  const [productBody, setProductBody] = useState(initialProductBody)
  useEffect(() => {
    setProductBody(initialProductBody)
  }, [initialProductBody, product])

  const setName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setProductBody((prev) => ({ ...prev, name: e.target.value }))
    },
    [setProductBody]
  )

  const setType = useCallback(
    (e: SelectChangeEvent) => {
      setProductBody((prev) => ({ ...prev, type: e.target.value }))
    },
    [setProductBody]
  )

  const setPrice = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setProductBody((prev) => ({ ...prev, price: e.target.value }))
    },
    [setProductBody]
  )

  const setContent = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setProductBody((prev) => ({ ...prev, content: e.target.value }))
    },
    [setProductBody]
  )

  const setUnswappable = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setProductBody((prev) => ({ ...prev, unswappable: e.target.checked }))
    },
    [setProductBody]
  )

  const setHasOriginalMail = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setProductBody((prev) => ({ ...prev, hasOriginalMail: e.target.checked }))
    },
    [setProductBody]
  )

  const setNote = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setProductBody((prev) => ({ ...prev, note: e.target.value }))
    },
    [setProductBody]
  )

  const productEdit = useProductEdit(product)

  const submit = useCallback(() => {
    const price = Number(productBody.price)
    if (isNaN(price)) return

    productEdit.edit({
      name: productBody.name,
      type: productBody.type,
      price: price,
      content: productBody.content,
      unswappable: productBody.unswappable,
      hasOriginalMail: productBody.hasOriginalMail,
      note: productBody.note,
    })

    onClose()
  }, [onClose, productBody, productEdit])

  return (
    <Dialog open={open} onClose={onClose} css={[dialogStyles, productDialogStyles]} className={className}>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <Select className="ProductDialog-Type" value={productBody.type} onChange={setType}>
          {productTypes.map((productType: ProductType) => (
            <MenuItem key={productType.name} value={productType.name}>
              {productType.name}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="name"
          size="small"
          className="ProductDialog-Name"
          value={productBody.name}
          onChange={setName}
        />
        <div className="ProductDialog-Price">
          <TextField label="price" size="small" type="number" value={productBody.price} onChange={setPrice} />
          <p className="ProductDialog-Currency">USD</p>
        </div>
        <TextareaAutosize
          css={textAreaStyles}
          placeholder="Product content here"
          aria-label="Product Content"
          minRows={2}
          value={productBody.content}
          onChange={setContent}
        />
        <TextareaAutosize
          css={textAreaStyles}
          placeholder="Product note here"
          aria-label="Product Note"
          onChange={setNote}
          value={productBody.note}
        />
        <div>
          <label className="ProductDialog-Checkbox">
            Unswappable
            <Checkbox checked={productBody.unswappable} onChange={setUnswappable} />
          </label>
          <label className="ProductDialog-Checkbox">
            Original Mail
            <Checkbox checked={productBody.hasOriginalMail} onChange={setHasOriginalMail} />
          </label>
        </div>
        <Button onClick={submit}>OK</Button>
      </DialogContent>
    </Dialog>
  )
})

function productDialogStyles() {
  return css`
    & .ProductDialog-Type .MuiSelect-select {
      padding: 8.5px 14px;
    }

    & .ProductDialog-Price {
      display: flex;
      align-items: center;
      gap: 3px;
    }

    & .ProductDialog-Currency {
      margin-top: 0;
      margin-bottom: 0;
    }

    & .ProductDialog-Checkbox {
      display: flex;
      align-items: center;
      justify-content: end;
    }
  `
}
