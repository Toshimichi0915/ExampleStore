import { getUserId } from "@/server/session/id.util"
import { GetServerSidePropsContext } from "next"
import { isProductAvailable } from "@/server/session/session.util"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { ChargeStatus } from "@/common/db.type"
import { chargePrismaToObj } from "@/server/mapper.util"
import { prisma } from "@/server/prisma.util"
import { PaymentPage } from "@/client/payments/payment.page"

export default PaymentPage

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

  if (!(await isProductAvailable(product, userId, session))) {
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
