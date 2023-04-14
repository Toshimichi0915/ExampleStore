import { Charge } from "@/common/db.type"
import { Theme } from "@mui/material"
import Link from "next/link"
import { css } from "@emotion/react"
import { paperStyles } from "@/client/common/styles"
import { ReactNode } from "react"

function PaymentCard({ className, title, description, children }: {
  className?: string,
  title: string,
  description: string,
  children: ReactNode
}) {
  return (
    <section className={className} css={[ paperStyles, paymentCardStyles ]}>
      <h2 className="Title">{title}</h2>
      <p className="Description">{description}</p>
      {children}
    </section>
  )
}

export function PaymentUrlCard({ charge }: { charge: Charge }) {
  return (
    <PaymentCard title="Payment" description="Click the URL shown below">
      <div css={paymentUrlCardStyles}>
        <Link href={charge.chargeUrl ?? ""} className="ChargeUrl">
          {charge.chargeUrl}
        </Link>
        <p className="Description">(Redirects to coinbase payment URL)</p>
      </div>
    </PaymentCard>
  )
}

export function InvoiceCard({ charge }: { charge: Charge }) {
  return (
    <PaymentCard title="Download Invoice" description="Click the icon to download the invoice">
      <p>Click here!</p>
    </PaymentCard>
  )
}

function paymentCardStyles() {
  return css`
    margin-top: 40px;
    margin-bottom: 60px;

    & .Title {
      margin: 0;
    }

    & .Description {
      margin: 0;
    }
  `
}


function paymentUrlCardStyles(theme: Theme) {
  return css`
    padding: 20px 0;

    & .ChargeUrl {
      text-align: center;
      display: block;
      text-decoration: none;
      color: ${theme.palette.info.light};

      &:hover {
        text-decoration: underline;
      }
    }

    & .Description {
      text-align: center;
    }
  `
}
