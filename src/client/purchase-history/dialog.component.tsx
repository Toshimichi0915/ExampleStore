import { useRouter } from "next/router"
import { usePurchaseHistory } from "@/client/purchase-history/history.hook"
import { useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, Theme } from "@mui/material"
import { ChargeItem } from "@/client/purchase-history/charge-item.component"
import { dialogStyles } from "@/client/common/styles"
import Link from "next/link"
import { css } from "@emotion/react"

export function PurchaseHistoryDialog({ className, open, onClose }: {
  className?: string,
  open: boolean;
  onClose: () => void,
}) {
  const router = useRouter()
  const { history, loaded } = usePurchaseHistory()

  useEffect(() => {
    onClose()
  }, [ onClose, router.pathname ])

  return (
    <Dialog open={open} onClose={onClose} className={className} css={[ dialogStyles, purchaseHistoryDialogStyles ]}>
      <DialogTitle className="PurchaseHistoryDialog-Title">Purchase History</DialogTitle>
      <DialogContent className="PurchaseHistoryDialog-Content">
        {loaded ? history.map((charge) => (
          <ChargeItem key={charge.id} charge={charge} className="PurchaseHistoryDialog-ChargeCard" />
        )) : (
          <p>Loading...</p>
        )
        }

        {router.pathname !== "/" && (
          <Link href="/" className="PurchaseHistoryDialog-TopNavigation">→ View all products</Link>
        )}
      </DialogContent>
    </Dialog>
  )
}

function purchaseHistoryDialogStyles(theme: Theme) {
  return css`
    & .PurchaseHistoryDialog-TopNavigation {
      text-decoration: none;
      color: white;
      margin-top: 40px;
      display: block;
      text-align: center;

      &:hover {
        text-decoration: underline;
        color: ${theme.palette.primary.light};
      }
    }
  `
}
