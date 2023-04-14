import { Product as PrismaProduct } from "@prisma/client"
import coinbase from "coinbase-commerce-node"
import { promisify } from "util"
import { chargePrismaToObj } from "@/server/mapper.util"
import { prisma } from "@/server/prisma.util"
import { Charge, Product } from "@/common/db.type"

const { Client } = coinbase
const { Charge } = coinbase.resources
type ChargeResource = coinbase.ChargeResource

const coinbaseApiKey: string = process.env.COINBASE_API_KEY ?? ""

Client.init(coinbaseApiKey)

export async function createCharge(product: Product | PrismaProduct, userId: string): Promise<Charge> {
  const charge = await prisma.charge.create({
    data: {
      productId: product.id,
      userId,
    },
  })

  const create = promisify(Charge.create).bind(Charge)

  let data: ChargeResource
  try {
    data = await create({
      name: product.name,
      description: `Purchase for ${product.name}`,
      pricing_type: "fixed_price",
      local_price: {
        amount: product.price.toString(),
        currency: "USD",
      },
      metadata: {
        customer_id: userId,
      },
    })
  } catch (e) {
    await prisma.charge.delete({ where: { id: charge.id } })
    throw e
  }

  return chargePrismaToObj(
    await prisma.charge.update({
      where: { id: charge.id },
      data: {
        coinbaseId: data.code,
        chargeUrl: data.hosted_url,
      },
    }),
    product,
  )
}

export async function resolveCharge(chargeId: string): Promise<void> {
  const res = await fetch(`https://api.commerce.coinbase.com/charges/${chargeId}/resolve`, {
    method: "POST",
    headers: {
      "X-CC-Api-Key": coinbaseApiKey,
      "X-CC-Version": "2018-03-22",
    },
  })

  if (!res.ok) {
    throw new Error(`Coinbase API responded with ${res.status}`)
  }
}
