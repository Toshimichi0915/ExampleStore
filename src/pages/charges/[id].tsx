import { GetServerSidePropsContext } from "next"
import { getUserId } from "@/server/session.util"
import { ChargeStatus } from "@/common/db.type"
import { chargePrismaToObj } from "@/server/mapper.util"
import { prisma } from "@/server/global.type"
import { PaymentPage } from "@/client/payments/payment.page"
import { getEnvironment } from "@/server/db"

export default PaymentPage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query

  if (typeof id !== "string") {
    return {
      notFound: true,
    }
  }

  const userId = await getUserId(context.req, context.res)
  if (!userId) {
    return {
      notFound: true,
    }
  }

  // pending payments
  const charge = await prisma.charge.findFirst({
    where: {
      id,
      userId,
      NOT: { status: ChargeStatus.FAILED },
    },
    include: {
      product: true,
    },
  })

  if (!charge) {
    return {
      notFound: true,
    }
  }

  const environment = await getEnvironment()

  return {
    props: {
      charge: chargePrismaToObj(charge, charge.product),
      environment,
    },
  }
}
