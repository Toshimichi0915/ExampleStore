import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"

const prisma = new PrismaClient()

export async function main() {
  const products = await prisma.product.findMany()

  for (const product of products) {
    const charge = await prisma.charge.create({
      data: {
        productId: product.id,
        userId: faker.string.uuid(),
        status: "CREATED",
      },
    })

    console.log(`Created charge ${charge.id} for ${product.name}(${product.id})`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
