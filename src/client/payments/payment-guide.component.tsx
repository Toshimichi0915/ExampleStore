import { Charge, ChargeStatus } from "@/common/db.type"
import { ReactNode } from "react"
import { css } from "@emotion/react"
import { InvoiceCard, PaymentUrlCard } from "@/client/payments/payment-card.component"

interface PaymentStatus {
  title: string,
  component: (charge: Charge) => ReactNode
}

const paymentStatuses: { [key in ChargeStatus]: PaymentStatus } = {
  [ChargeStatus.CREATED]: {
    title: "Awaiting Payment",
    component: (charge) => (
      <>
        <PaymentUrlCard charge={charge} />
        <InvoiceCard charge={charge} />
      </>
    ),
  },
  [ChargeStatus.CONFIRMED]: {
    title: "Payment confirmed",
    component: () => (<></>),
  },
  [ChargeStatus.FAILED]: {
    title: "Payment Failed",
    component: () => (<></>),
  },
  [ChargeStatus.DELAYED]: {
    title: "Payment Delayed",
    component: () => (<></>),
  },
  [ChargeStatus.PENDING]: {
    title: "Awaiting Confirmation",
    component: () => (<></>),
  },
  [ChargeStatus.RESOLVED]: {
    title: "Payment Completed",
    component: () => (<></>),
  },
} as const

export function PaymentGuide({ charge, className }: { charge: Charge; className?: string }) {

  const paymentStatus = paymentStatuses[charge.status]
  const title = paymentStatus.title
  const component = paymentStatus.component(charge)

  return (
    <main css={paymentGuideStyles} className={className}>
      <h1>{title}</h1>
      {component}
    </main>
  )
}

function paymentGuideStyles() {
  return css`
    padding: 40px 20px;

    @media (min-width: 768px) {
      padding: 40px 60px;
    }

    @media (min-width: 1024px) {
      width: 768px;
      margin: 0 auto;
    }

    @media (min-width: 1280px) {
      width: 1024px;
      margin: 0 auto;
    }
  `
}
