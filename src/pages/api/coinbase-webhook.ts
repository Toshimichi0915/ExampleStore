import { NextApiRequest, NextApiResponse } from "next"
import coinbase, { ChargeResource, resources } from "coinbase-commerce-node"
import { Charge, ChargeStatus, Product } from "@/common/db.type"
import { Charge as PrismaCharge, Product as PrismaProduct } from "@prisma/client"
import { prisma } from "@/server/prisma.util"
import { buffer } from "micro"
import { middleware } from "next-pipe"

const { Webhook } = coinbase

const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET ?? ""

export const config = {
  api: {
    bodyParser: false,
  },
}

async function resolveCharge(charge: Charge | PrismaCharge, product: Product | PrismaProduct) {
  await prisma.$transaction([
    prisma.charge.update({
      where: { id: charge.id },
      data: { status: ChargeStatus.RESOLVED },
    }),
    prisma.charge.updateMany({
      where: { NOT: { id: charge.id }, productId: product.id },
      data: { status: ChargeStatus.INVALIDATED },
    }),
  ])
}

export default middleware<NextApiRequest, NextApiResponse>().pipe(async (req, res) => {
  const sigHeader = req.headers["x-cc-webhook-signature"]
  if (typeof sigHeader !== "string") {
    res.status(400).send("Bad request")
    return
  }

  const rawBody = await buffer(req)
  let event: resources.Event
  try {
    event = Webhook.verifyEventBody(rawBody.toString(), sigHeader, webhookSecret)
  } catch (e) {
    res.status(400).send("Bad request")
    return
  }

  const code = (event.data as ChargeResource).code

  const charge = await prisma.charge.findUnique({
    where: { coinbaseId: code },
    include: { product: true },
  })

  if (!charge) {
    throw new Error(`Charge not found: ${code}`)
  }

  // This is an edge case where other buyers already paid for the product.
  // We need this buyer to contact the support, so we can refund the payment.
  if (charge.status === ChargeStatus.INVALIDATED) return

  switch (event.type) {
    case "charge:created":
      await prisma.charge.update({
        where: { coinbaseId: code },
        data: { status: ChargeStatus.CREATED },
      })
      break

    case "charge:confirmed":
      await resolveCharge(charge, charge.product)
      break

    case "charge:failed":
      await prisma.charge.update({
        where: { coinbaseId: code },
        data: { status: ChargeStatus.FAILED },
      })
      break

    case "charge:delayed":
      await resolveCharge(charge, charge.product)
      break

    case "charge:pending":
      await prisma.charge.update({
        where: { coinbaseId: code },
        data: { status: ChargeStatus.PENDING },
      })
      break

    case "charge:resolved":
      await resolveCharge(charge, charge.product)
      break

    default:
      res.status(400).send(`Unknown event type: ${event.type}`)
  }

  res.status(200).end()
})
