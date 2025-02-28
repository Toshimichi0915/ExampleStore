import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"

const prisma = new PrismaClient()

async function addProductType(name: string) {
  await prisma.productType.upsert({
    where: { name },
    update: {
      /* do nothing */
    },
    create: { name },
  })
}

async function addProduct(type: string, count: number) {
  for (let i = 0; i < count; i++) {
    const username = `${type}-${i}`
    const price = faker.commerce.price()

    console.log(`Creating product @${username} with price ${price}`)
    await prisma.product.create({
      data: {
        name: `@${username}`,
        typeId: type,
        price: parseInt(price, 10),
        content: faker.lorem.paragraph(1),
      },
    })
  }
}

export async function main() {
  await addProductType("Example1")
  await addProductType("Example2")
  await addProductType("Example3")

  await addProduct("Example1", 500)
  await addProduct("Example2", 500)
  await addProduct("Example3", 500)
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
