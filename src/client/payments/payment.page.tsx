import { useCharge } from "@/client/payments/payment.hook"
import { PaymentGuide } from "@/client/payments/payment-guide.component"
import { PaymentInfo } from "@/client/payments/payment-info.component"
import { css } from "@emotion/react"
import { InferGetServerSidePropsType } from "next"
import { getServerSideProps } from "@/pages/charges/[id]"
import { memo } from "react"

export const PaymentPage = memo(function PaymentPage({
  charge: initialCharge,
  environment: initialEnvironment,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const charge = useCharge(initialCharge)

  return (
    <div css={paymentPageStyles}>
      <PaymentGuide charge={charge} className="Payment-PaymentGuide" />
      <PaymentInfo charge={charge} environment={initialEnvironment} />
    </div>
  )
})

function paymentPageStyles() {
  return css`
    display: flex;
    flex-direction: column;

    @media (min-width: 768px) {
      flex-direction: row;
      min-height: 100vh;
    }

    .Payment-PaymentGuide {
      flex: 1;
    }
  `
}
