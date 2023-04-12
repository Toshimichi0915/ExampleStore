import { Dialog, DialogContent, DialogTitle, Theme, css, useTheme } from "@mui/material"
import { Styles } from "@/common/css"
import { useCallback, useEffect, useState } from "react"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import { usePurchaseHitory } from "@/hooks/history"
import { Charge } from "@/common/product"
import { defaultDialogContentStyles, defaultDialogStyles } from "@/styles/mui"
import Link from "next/link"
import { useRouter } from "next/router"

export const defaultPurchaseHistoryStyles: Styles = () =>
  css({
    "& .HistoryDialogPaper": {
      display: "flex",
      position: "fixed",
      top: 0,
      left: 0,
      alignItems: "center",
      margin: 16,
      gap: 10,
    },
    "& .HistoryDialogPaper-Button": {
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      border: "0",
      padding: 5,
      width: 40,
      height: 40,
      borderRadius: 4,
    },
    "& .HistoryDialogPaper-Icon": {
      color: "black",
    },
  })

export const chargeCardStyles: Styles = (theme: Theme) =>
  css({
    textDecoration: "none",
    "& .ChargeCard-Container": {
      display: "flex",
      justifyContent: "space-between",
      color: theme.palette.text.primary,
      borderRadius: 4,
      padding: "10px 15px",
      transition: "background-color 0.2s",
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
      },
    },
    "& .ChargeCard-ProductName": {
      margin: 0,
    },
    "& .ChargeCard-ChargeStatus": {
      margin: 0,
    },
  })

function ChargeCard({ charge }: { charge: Charge }) {
  const theme = useTheme()
  return (
    <Link href={`/products/${charge.productId}`} css={chargeCardStyles(theme)}>
      <div className="ChargeCard-Container">
        <p className="ChargeCard-ProductName">{charge.product.name}</p>
        <p className="ChargeCard-ChargeStatus">{charge.status}</p>
      </div>
    </Link>
  )
}

function PurchaseHistoryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useTheme()
  const router = useRouter()
  const { history, loaded } = usePurchaseHitory()

  useEffect(() => {
    onClose()
  }, [onClose, router.pathname])

  return (
    <Dialog open={open} onClose={onClose} css={defaultDialogStyles(theme)}>
      <DialogTitle>Purchase History</DialogTitle>
      <DialogContent css={defaultDialogContentStyles(theme)}>
        {loaded ? history.map((charge) => <ChargeCard key={charge.id} charge={charge} />) : <p>Loading...</p>}
      </DialogContent>
    </Dialog>
  )
}

export function PurchaseHistory({ className }: { className?: string }) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false)
  }, [])

  const handleButtonClick = useCallback(() => {
    setDialogOpen(true)
  }, [])

  return (
    <div className={className}>
      <PurchaseHistoryDialog open={dialogOpen} onClose={handleDialogClose} />
      <div className="HistoryDialogPaper">
        <button onClick={handleButtonClick} className="HistoryDialogPaper-Button">
          <ShoppingCartIcon className="HistoryDialogPaper-Icon" />
        </button>
      </div>
    </div>
  )
}
