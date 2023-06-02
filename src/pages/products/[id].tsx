import { GetServerSidePropsContext } from "next"
import { getUserId, isProductAvailable } from "@/server/session.util"
import { ChargeStatus } from "@/common/db.type"
import { chargePrismaToObj } from "@/server/mapper.util"
import { prisma } from "@/server/prisma.util"
import { PaymentPage } from "@/client/payments/payment.page"
import { getEnvironment } from "@/server/environment"

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

  if (!(await isProductAvailable(product, context.req, context.res))) {
    return {
      notFound: true,
    }
  }

  const environment = await getEnvironment()

  return {
    props: {
      charge: chargePrismaToObj(charge, product),
      environment,
    },
  }
}
