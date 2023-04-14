import { useCharge } from "@/client/payments/payment.hook"
import { PaymentGuide } from "@/client/payments/payment-guide.component"
import { PaymentInfo } from "@/client/payments/payment-info.component"
import { css } from "@emotion/react"
import { InferGetServerSidePropsType } from "next"
import { getServerSideProps } from "@/pages/products/[id]"

export function PaymentPage({ charge: initialCharge }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const charge = useCharge(initialCharge)

  return (
    <div css={paymentPageStyles}>
      <PaymentGuide charge={charge} />
      <PaymentInfo charge={charge} />
    </div>
  )
}

function paymentPageStyles() {
  return css`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    @media (min-width: 768px) {
      flex-direction: row;
      min-height: 100vh;
    }
  `
}
