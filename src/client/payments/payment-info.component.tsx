import { Charge, ChargeStatusNames } from "@/common/db.type"
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
      <h1 className="PaymentInfo-Title">Payment Status</h1>
      <PaymentInfoRow left="Name" right={charge.product.name} className="PaymentInfo-PaymentInfoRow" />
      <PaymentInfoRow left="Status" right={ChargeStatusNames[charge.status]} className="PaymentInfo-PaymentInfoRow" />
      <PaymentInfoRow left="Price" right={`$${charge.product.price}`} className="PaymentInfo-PaymentInfoRow" />
      <PaymentInfoRow left="Type" right={charge.product.type ?? "UNKNOWN"} className="PaymentInfo-PaymentInfoRow" />
    </div>
  )
}

function paymentInfoStyles(theme: Theme) {
  return css`
    position: sticky;
    top: 0;
    height: 100vh;
    padding: 40px 60px;
    background-color: ${theme.palette.background.paper};

    & .PaymentInfo-Title {
      margin-bottom: 40px;
    }

    & .PaymentInfo-PaymentInfoRow {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;

      & .PaymentInfoRow-Left {
        margin: 0;
      }

      & .PaymentInfoRow-Right {
        margin: 0;
      }
    }
  `
}
