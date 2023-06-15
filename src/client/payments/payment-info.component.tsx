import { Charge, ChargeStatusNames, Environment } from "@/common/db.type"
import { css } from "@emotion/react"
import { Theme } from "@mui/material"
import Link from "next/link"
import { memo } from "react"

const PaymentInfoRow = memo(function PaymentInfoRow({
  left,
  right,
  className,
}: {
  left: string
  right: string
  className?: string
}) {
  return (
    <div className={className}>
      <p className="PaymentInfoRow-Left">{left}</p>
      <p className="PaymentInfoRow-Right">{right}</p>
    </div>
  )
})

export const PaymentInfo = memo(function PaymentInfo({
  charge,
  environment,
  className,
}: {
  charge: Charge
  environment: Environment
  className?: string
}) {
  return (
    <div css={paymentInfoStyles} className={className}>
      <div className="PaymentInfo-Container">
        <h1 className="PaymentInfo-Title">Payment Status</h1>
        <PaymentInfoRow left="Name" right={charge.product.name} className="PaymentInfo-PaymentInfoRow" />
        <PaymentInfoRow left="Status" right={ChargeStatusNames[charge.status]} className="PaymentInfo-PaymentInfoRow" />
        <PaymentInfoRow left="Price" right={`$${charge.product.price}`} className="PaymentInfo-PaymentInfoRow" />
        <PaymentInfoRow left="Type" right={charge.product.type ?? "UNKNOWN"} className="PaymentInfo-PaymentInfoRow" />
      </div>
      <p className="PaymentInfo-Note">
        Note: it might take a while for the transaction to be processed. If the payment does not complete in 24 hours,
        please contact us via{" "}
        <Link className="PaymentInfo-Telegram" href={environment.telegramUrl}>
          Telegram
        </Link>
      </p>
    </div>
  )
})

function paymentInfoStyles(theme: Theme) {
  return css`
    position: sticky;
    top: 0;
    height: 100vh;
    background-color: ${theme.palette.background.paper};
    display: flex;
    flex-direction: column;

    @media (min-width: 768px) {
      width: 400px;
    }

    @media (min-width: 1024px) {
      width: 500px;
    }

    & .PaymentInfo-Container {
      flex: 1;
      padding: 40px 60px;
    }

    & .PaymentInfo-Note {
      padding: 10px 20px;
    }

    & .PaymentInfo-Telegram {
      color: ${theme.palette.primary.main};

      &:hover {
        color: ${theme.palette.primary.light};
        text-decoration: underline;
      }
    }

    & .PaymentInfo-Title {
      margin-bottom: 40px;
      text-align: center;
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
