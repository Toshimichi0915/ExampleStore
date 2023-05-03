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
        left="Name"
        right={charge.product.name}
        className="PaymentInfo-PaymentInfoRow"
      />
      <PaymentInfoRow
        left="Status"
        right={charge.status}
        className="PaymentInfo-PaymentInfoRow"
      />
      <PaymentInfoRow
        left="Price"
        right={`$${charge.product.price}`}
        className="PaymentInfo-PaymentInfoRow"
      />
      <PaymentInfoRow
        left="Type"
        right={charge.product.type ?? "UNKNOWN"}
        className="PaymentInfo-PaymentInfoRow"
      />
    </div>
  )
}

function paymentInfoStyles(theme: Theme) {
  return css`
    padding: 40px 60px;
    background-color: ${theme.palette.background.light};

    & .PaymentInfo-PaymentInfoRow {
      display: flex;
      justify-content: space-between;
    }
  `
}
