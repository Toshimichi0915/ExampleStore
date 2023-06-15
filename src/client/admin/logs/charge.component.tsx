import { Button, Theme } from "@mui/material"
import { css } from "@emotion/react"
import { Charge, ProductType, PurchasedProduct } from "@/common/db.type"
import { ChargeEditDialog } from "@/client/admin/settings/dialog/charge.component"
import { forwardRef, memo, useCallback, useState } from "react"

export const LogsCharge = memo(
  forwardRef<HTMLDivElement, { charge: Charge; productTypes: ProductType[] }>(function LogsCharge(
    { charge, productTypes },
    ref
  ) {
    const [open, setOpen] = useState(false)
    const [product, setProduct] = useState<PurchasedProduct>()

    const closeDialog = useCallback(() => {
      setOpen(false)
    }, [])

    const openDialog = useCallback(async () => {
      setOpen(true)
      const data = await fetch(`/api/products/${charge.product.id}`).catch((e) => {
        console.log(e)
      })

      if (data) {
        setProduct(await data.json())
      }
    }, [charge.product.id])

    return (
      <div key={charge.id} css={logsChargeStyles} ref={ref}>
        {product && (
          <ChargeEditDialog
            open={open}
            onClose={closeDialog}
            charge={charge}
            product={product}
            productTypes={productTypes}
          />
        )}
        <div className="LogsCharge-Row">
          <div className="LogsCharge-Left">
            <p className="LogsCharge-Line LogsCharge-Line1">
              {charge.id} ({charge.product.name})
            </p>
            <p className="LogsCharge-Line LogsCharge-Line2">
              ${charge.product.price} - {new Date(charge.createdAt).toLocaleString()}
            </p>
          </div>
          <Button onClick={openDialog}>VIEW</Button>
        </div>
      </div>
    )
  })
)

function logsChargeStyles(theme: Theme) {
  return css`
    & .LogsCharge-Row {
      display: flex;
      margin: 20px 0;
      padding: 14px 14px;
      border-radius: 3px;
      background-color: ${theme.palette.background.dark};
      border: 1px solid ${theme.palette.border.paper};
    }

    & .LogsCharge-Left {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    & .LogsCharge-Left {
      flex: 1;
    }

    & .LogsCharge-Line {
      margin: 0;
    }
  `
}
