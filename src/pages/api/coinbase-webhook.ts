import { NextApiRequest, NextApiResponse } from "next"
import { ChargeStatus, prisma } from "@/server/db"
import coinbase from "coinbase-commerce-node"
import { resolveCharge } from "@/server/coinbase"

const { Webhook } = coinbase
type ChargeResource = coinbase.ChargeResource

const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET ?? ""

interface Webhook {
  id: number
  scheduled_for: string
  event: {
    id: string
    resource: string
    type: string
    api_version: string
    created_at: string
    data: ChargeResource
  }
}

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

  try {
    Webhook.verifyEventBody(req.body, sigHeader, webhookSecret)
  } catch (e) {
    res.status(400).send("Bad request")
    return
  }

  let data: Webhook

  try {
    data = JSON.parse(req.body)
  } catch (e) {
    res.status(400).send(`Could not parse request body: ${e}`)
    return
  }

  const code = data.event.data.code
  switch (data.event.type) {
    case "charge:created":
      break

    case "charge:confirmed":
      await prisma.charge.update({
        where: { coinbaseId: code },
        data: { status: ChargeStatus.CONFIRMED },
      })
      await resolveCharge(code)
      break

    case "charge:failed":
      await prisma.charge.update({
        where: { coinbaseId: code },
        data: { status: ChargeStatus.FAILED },
      })
      break

    case "charge:delayed":
      await prisma.charge.update({
        where: { coinbaseId: code },
        data: { status: ChargeStatus.DELAYED },
      })

      const validCharge = await prisma.product.findFirst({
        where: { charges: { some: { coinbaseId: code } } },
        include: { charges: { where: { NOT: { status: ChargeStatus.FAILED } } } },
      })
      if (validCharge) return

      await resolveCharge(code)
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
      res.status(400).send(`Unknown event type: ${data.event.type}`)
  }
}
