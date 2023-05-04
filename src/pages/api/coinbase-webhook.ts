import { NextApiRequest, NextApiResponse } from "next"
import coinbase, { ChargeResource, resources } from "coinbase-commerce-node"
import { ChargeStatus } from "@/common/db.type"
import { prisma } from "@/server/prisma.util"
import { buffer } from "micro"

const { Webhook } = coinbase

const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET ?? ""

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
  switch (event.type) {
    case "charge:created":
      await prisma.charge.update({
        where: { coinbaseId: code },
        data: { status: ChargeStatus.CREATED },
      })
      break

    case "charge:confirmed":
      await prisma.charge.update({
        where: { coinbaseId: code },
        data: { status: ChargeStatus.RESOLVED },
      })
      break

    case "charge:failed":
      await prisma.charge.update({
        where: { coinbaseId: code },
        data: { status: ChargeStatus.FAILED },
      })
      break

    case "charge:delayed":
      const validCharge = await prisma.product.findFirst({
        where: { charges: { some: { coinbaseId: code } } },
        include: { charges: { where: { NOT: { status: ChargeStatus.FAILED } } } },
      })
      if (!validCharge) {
        await prisma.charge.update({
          where: { coinbaseId: code },
          data: { status: ChargeStatus.RESOLVED },
        })
      }

      break

    case "charge:pending":
      await prisma.charge.update({
        where: { coinbaseId: code },
        data: { status: ChargeStatus.PENDING },
      })
      break

    case "charge:resolved":
      await prisma.charge.update({
        where: { coinbaseId: code },
        data: { status: ChargeStatus.RESOLVED },
      })
      break

    default:
      res.status(400).send(`Unknown event type: ${event.type}`)
  }

  res.status(200).end()
}
