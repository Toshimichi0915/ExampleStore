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
import { CircularProgress } from "@mui/material"

interface PaymentStatus {
  title: string

  component(charge: Charge): ReactNode
}

const paymentStatuses: { [key in ChargeStatus]: PaymentStatus } = {
  [ChargeStatus.INITIALIZING]: {
    title: "Initializing",
    component: () => (
      <>
        <PaymentCard title="Initializing" description="Please wait a moment..." />
      </>
    ),
  },
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
    title: "Payment Confirmed",
    component: (charge) => (
      <>
        <PaymentCard title="Payment Confirmed" description="The item you ordered will arrive very soon..." />
        <InvoiceCard charge={charge} />
      </>
    ),
  },
  [ChargeStatus.FAILED]: {
    title: "Payment Failed",
    component: (charge) => (
      <>
        <PaymentCard
          title="Payment Failed"
          description="Sorry but payment has failed. Please try again from the beginning :("
        />
        <InvoiceCard charge={charge} />
      </>
    ),
  },
  [ChargeStatus.DELAYED]: {
    title: "Payment Delayed",
    component: (charge) => (
      <>
        <PaymentCard title="Payment Confirmed" description="The item you ordered will arrive very soon..." />
        <InvoiceCard charge={charge} />
      </>
    ),
  },
  [ChargeStatus.PENDING]: {
    title: "Awaiting Confirmation",
    component: (charge) => (
      <>
        <PaymentCard
          title="Awaiting Confirmation"
          description="The payment is now being processed by the blockchain..."
        />
        <InvoiceCard charge={charge} />
      </>
    ),
  },
  [ChargeStatus.RESOLVED]: {
    title: "Payment Completed",
    component: (charge) => (
      <>
        <PaymentCard
          title="Thank you for your purchase!"
          description={[
            `If you haven't provided reputation or vouch on flipd.gg/Genshin, we would appreciate it if you could do so.`,
            `We typically respond within 24 hours.`,
            `If you have any concerns or questions, please feel free to contact us.`,
          ]}
        />
        <PreviewCard charge={charge} />
        <DownloadCard charge={charge} />
        <InvoiceCard charge={charge} />
      </>
    ),
  },
  [ChargeStatus.INVALIDATED]: {
    title: "Payment Invalidated",
    component: (charge) => (
      <>
        <PaymentCard
          title="Another person has sent crypto currency earlier."
          description="If you already sent your crypto currency, contact support for refund."
        />
        <InvoiceCard charge={charge} />
      </>
    ),
  },
} as const

export function PaymentGuide({ charge, className }: { charge: Charge; className?: string }) {
  const paymentStatus = paymentStatuses[charge.status]
  const title = paymentStatus.title
  const component = useMemo(() => paymentStatus.component(charge), [charge, paymentStatus])

  const showCircularProgress = !([ChargeStatus.RESOLVED, ChargeStatus.INVALIDATED] as string[]).includes(charge.status)

  return (
    <main css={paymentGuideStyles} className={className}>
      <h1 className="PaymentGuide-Title">
        {title} {showCircularProgress && <CircularProgress />}
      </h1>
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
      padding: 40px 124px;
    }

    @media (min-width: 1280px) {
      padding: 40px 160px;
    }

    & .PaymentGuide-Title {
      display: flex;
      align-items: center;
      gap: 20px;
    }
  `
}
