import { Charge, ChargeStatus } from "@/common/db.type"
import { ReactNode, useMemo } from "react"
import { css } from "@emotion/react"
import {
  DownloadCard,
  InvoiceCard,
  PaymentCard,
  PaymentUrlCard,
  PreviewCard,
} from "@/client/payments/payment-card.component"

interface PaymentStatus {
  title: string,

  component(charge: Charge): ReactNode
}

const paymentStatuses: { [key in ChargeStatus]: PaymentStatus } = {
  [ChargeStatus.CREATED]: {
    title: "Awaiting Payment",
    component: (charge) => (<>
      <PaymentUrlCard charge={charge} />
      <InvoiceCard charge={charge} />
    </>),
  },
  [ChargeStatus.CONFIRMED]: {
    title: "Payment Confirmed",
    component: (charge) => (<>
      <PaymentCard title="Payment Confirmed" description="The item you ordered will arrive very soon..." />
      <InvoiceCard charge={charge} />
    </>),
  },
  [ChargeStatus.FAILED]: {
    title: "Payment Failed",
    component: (charge) => (<>
      <PaymentCard title="Payment Failed"
                   description="Sorry but payment has failed. Please try again from the beginning :(" />
      <InvoiceCard charge={charge} />
    </>),
  },
  [ChargeStatus.DELAYED]: {
    title: "Payment Delayed",
    component: (charge) => (<>
      <PaymentCard title="Payment Confirmed" description="The item you ordered will arrive very soon..." />
      <InvoiceCard charge={charge} />
    </>),
  },
  [ChargeStatus.PENDING]: {
    title: "Awaiting Confirmation",
    component: (charge) => (<>
      <PaymentCard title="Awaiting Confirmation"
                   description="The payment is now being processed by the blockchain..." />
      <InvoiceCard charge={charge} />
    </>),
  },
  [ChargeStatus.RESOLVED]: {
    title: "Payment Completed",
    component: (charge) => (<>
      <DownloadCard charge={charge} />
      <PreviewCard charge={charge} />
      <InvoiceCard charge={charge} />
    </>),
  },
} as const

export function PaymentGuide({ charge, className }: { charge: Charge; className?: string }) {

  const paymentStatus = paymentStatuses[charge.status]
  const title = paymentStatus.title
  const component = useMemo(() => (paymentStatus.component(charge)), [ charge, paymentStatus ])

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
    overflow: hidden;

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
