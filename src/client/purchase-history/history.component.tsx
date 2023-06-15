import { memo, useCallback, useState } from "react"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import { PurchaseHistoryDialog } from "@/client/purchase-history/dialog.component"
import { css } from "@mui/material"

export const PurchaseHistory = memo(function PurchaseHistory({ className }: { className?: string }) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const closeDialog = useCallback(() => setDialogOpen(false), [])
  const clickButton = useCallback(() => setDialogOpen(true), [])

  return (
    <div css={purchaseHistoryStyles} className={className}>
      <PurchaseHistoryDialog open={dialogOpen} onClose={closeDialog} />
      <div className="PurchaseHistory-Paper">
        <button onClick={clickButton} className="PurchaseHistory-Button">
          <ShoppingCartIcon className="PurchaseHistory-Icon" />
        </button>
      </div>
    </div>
  )
})

function purchaseHistoryStyles() {
  return css`
    background-color: red;

    & .PurchaseHistory-Paper {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      align-items: center;
      margin: 16px;
      gap: 10px;
    }

    & .PurchaseHistory-Button {
      background-color: rgba(255, 255, 255, 0.7);
      border: 0;
      padding: 5px;
      width: 40px;
      height: 40px;
      border-radius: 4px;
    }

    & .PurchaseHistory-Icon {
      color: black;
    }
  `
}
