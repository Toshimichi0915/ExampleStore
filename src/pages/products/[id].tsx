import { getUserId } from "@/server/id"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { chargePrismaToObj, ChargeStatus, prisma, productPrismaToObj } from "@/server/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default function Page({ charge, product }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <h1>{product.name}</h1>
      <p>Price: {product.price}</p>
      <p>URL {charge.chargeUrl}</p>
    </main>
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
  const session = await getServerSession(context.req, context.res, authOptions)

  const charge = await prisma.charge.findFirst({
    where: {
      productId: id,
      userId: userId,
      NOT: { status: ChargeStatus.FAILED },
    },
  })

  if (!charge) {
    return {
      notFound: true,
    }
  }

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

  const productObj = productPrismaToObj(product, userId, session)
  if (!productObj.available) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      charge: chargePrismaToObj(charge),
      product: productObj,
    },
  }
}
