import { getUserId } from "@/server/id"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { chargePrismaToObj, isProductAvailable, prisma } from "@/server/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { Charge, ChargeStatus } from "@/common/product"
import { Styles } from "@/common/css"
import { css } from "@emotion/react"
import { Theme, useTheme } from "@mui/material"
import { ReactNode } from "react"
import { defaultPaperStyles } from "@/styles/mui"
import Link from "next/link"

const PaymentStatusTitles = {
  [ChargeStatus.CREATED]: "Awaiting Payment",
  [ChargeStatus.CONFIRMED]: "Payment confirmed",
  [ChargeStatus.FAILED]: "Payment Failed",
  [ChargeStatus.DELAYED]: "Payment Delayed",
  [ChargeStatus.PENDING]: "Awaiting Confirmation",
  [ChargeStatus.RESOLVED]: "Payment Completed",
} as const

const pageStyles: Styles = (theme: Theme) =>
  css({
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    "@media (min-width: 1024px)": {
      flexDirection: "row",
      minHeight: "100vh",
    },

    "& .Page-Container": {
      flex: 1,
    },
    "& .Page-PaymentGuide": {
      padding: "40px 20px",
      "@media (min-width: 1024px)": {
        width: "800px",
        margin: "0 auto",
      },
    },
    "& .Page-PaymentInfo": {
      padding: "40px 60px",
      backgroundColor: theme.palette.background.light,
      "& .PaymentInfo-PaymentInfoRow": {
        display: "flex",
        justifyContent: "space-between",
      },
    },
  })

const paymentGuideCardStyles: Styles = (theme: Theme) =>
  css({
    margin: "40px 0",
    "& .PaymentGuide-Title": {
      margin: 0,
    },
  })

const paymentCardStyles: Styles = (theme: Theme) =>
  css({
    "& .CoinbaseCard-Container": {
      padding: "20px 0",
    },
    "& .CoinbaseCard-ChargeUrl": {
      textAlign: "center",
      display: "block",
      textDecoration: "none",
      color: theme.palette.info.light,
      "&:hover": {
        textDecoration: "underline",
      },
    },
    "& .CoinbaseCard-Description": {
      textAlign: "center",
    },
  })

function PaymentGuideCard({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={className}>
      <h2 className="PaymentGuide-Title">{title}</h2>
      {children}
    </section>
  )
}

function CoinbaseCards({ charge }: { charge: Charge }) {
  const theme = useTheme()

  return (
    <div>
      <PaymentGuideCard
        title="Payment"
        css={[defaultPaperStyles(theme), paymentGuideCardStyles(theme), paymentCardStyles(theme)]}
      >
        <p>Click the URL shown below</p>
        <div className="CoinbaseCard-Container">
          <Link href={charge.chargeUrl ?? ""} className="CoinbaseCard-ChargeUrl">
            {charge.chargeUrl}
          </Link>
          <p className="CoinbaseCard-Description">(Redirects to coinbase payment URL)</p>
        </div>
      </PaymentGuideCard>
      <PaymentGuideCard
        title="Download Invoice"
        css={[defaultPaperStyles(theme), paymentGuideCardStyles(theme), paymentCardStyles(theme)]}
      >
        <p>Click the URL shown below</p>
        <div className="CoinbaseCard-Container">
          <Link href={charge.chargeUrl ?? ""} className="CoinbaseCard-ChargeUrl">
            {charge.chargeUrl}
          </Link>
          <p className="CoinbaseCard-Description">(Redirects to coinbase payment URL)</p>
        </div>
      </PaymentGuideCard>
    </div>
  )
}

function PaymentGuide({ charge, className }: { charge: Charge; className?: string }) {
  return (
    <main className={className}>
      <h1>{PaymentStatusTitles[charge.status]}</h1>
      <CoinbaseCards charge={charge} />
    </main>
  )
}

function PaymentInfoRow({ left, right, className }: { left: string; right: string; className?: string }) {
  return (
    <div className={className}>
      <p className="PaymentInfoRow-Left">{left}</p>
      <p className="PaymentInfoRow-Right">{right}</p>
    </div>
  )
}

function PaymentInfo({ charge, className }: { charge: Charge; className?: string }) {
  return (
    <div className={className}>
      <h1>Payment Status</h1>
      <PaymentInfoRow
        left="Status"
        right={charge.status}
        className="PaymentInfo-PaymentInfoRow PaymentInfo-PaymentInfoRow-Status"
      />
      <PaymentInfoRow
        left="Price"
        right={`$${charge.product.price}`}
        className="PaymentInfo-PaymentInfoRow PaymentInfo-PaymentInfoRow-Price"
      />
      <PaymentInfoRow
        left="Type"
        right={charge.product.type ?? "UNKNOWN"}
        className="PaymentInfo-PaymentInfoRow PaymentInfo-PaymentInfoRow-Type"
      />
    </div>
  )
}

export default function Page({ charge }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const theme = useTheme()

  return (
    <div css={pageStyles(theme)}>
      <div className="Page-Container">
        <PaymentGuide charge={charge} className="Page-PaymentGuide" />
      </div>
      <PaymentInfo charge={charge} className="Page-PaymentInfo" />
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query

  if (typeof id !== "string") {
    return {
      notFound: true,
    }
  }

  const userId = getUserId(context.req, context.res)
  if (!userId) {
    return {
      notFound: true,
    }
  }

  const session = await getServerSession(context.req, context.res, authOptions)

  // pending payments
  const charge = await prisma.charge.findFirst({
    where: {
      productId: id,
      userId,
      NOT: { status: ChargeStatus.FAILED },
    },
  })

  if (!charge) {
    return {
      notFound: true,
    }
  }

  // check if product is available
  const product = await prisma.product.findFirst({
    where: {
      id: id,
    },
    include: {
      charges: true,
    },
  })

  if (!product) {
    return {
      notFound: true,
    }
  }

  if (!isProductAvailable(product, userId, session)) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      charge: chargePrismaToObj(charge, product),
    },
  }
}
