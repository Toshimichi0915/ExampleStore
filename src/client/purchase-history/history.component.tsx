import { useCallback, useState } from "react"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import { PurchaseHistoryDialog } from "@/client/purchase-history/dialog.component"
import { css } from "@mui/material"

export function PurchaseHistory({ className }: { className?: string }) {
  const [ dialogOpen, setDialogOpen ] = useState(false)

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false)
  }, [])

  const handleButtonClick = useCallback(() => {
    setDialogOpen(true)
  }, [])

  return (
    <div css={purchaseHistoryStyles} className={className}>
      <PurchaseHistoryDialog open={dialogOpen} onClose={handleDialogClose} />
      <div className="Paper">
        <button onClick={handleButtonClick} className="Button">
          <ShoppingCartIcon className="Icon" />
        </button>
      </div>
    </div>
  )
}

function purchaseHistoryStyles() {
  return css`
    background-color: red;

    & .Paper {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      align-items: center;
      margin: 16px;
      gap: 10px;
    }

    & .Button {
      background-color: rgba(255, 255, 255, 0.7);
      border: 0;
      padding: 5px;
      width: 40px;
      height: 40px;
      border-radius: 4px;
    }

    & .Icon {
      color: black;
    }
  `
}
