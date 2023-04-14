import { Charge } from "@/common/db.type"
import { css } from "@emotion/react"
import { Theme } from "@mui/material"

function PaymentInfoRow({ left, right, className }: { left: string; right: string; className?: string }) {
  return (
    <div className={className}>
      <p className="PaymentInfoRow-Left">{left}</p>
      <p className="PaymentInfoRow-Right">{right}</p>
    </div>
  )
}

export function PaymentInfo({ charge, className }: { charge: Charge; className?: string }) {
  return (
    <div css={paymentInfoStyles} className={className}>
      <h1>Payment Status</h1>
      <PaymentInfoRow
        left="Status"
        right={charge.status}
        className="PaymentInfoRow"
      />
      <PaymentInfoRow
        left="Price"
        right={`$${charge.product.price}`}
        className="PaymentInfoRow"
      />
      <PaymentInfoRow
        left="Type"
        right={charge.product.type ?? "UNKNOWN"}
        className="PaymentInfoRow"
      />
    </div>
  )
}

function paymentInfoStyles(theme: Theme) {
  return css`
    padding: 40px 60px;
    background-color: ${theme.palette.background.light};

    & .PaymentInfoRow {
      display: flex;
      justify-content: space-between;
    }
  `
}
