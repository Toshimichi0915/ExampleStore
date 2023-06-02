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
    const username = faker.internet.userName()
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
  await addProductType("Twitter OG")
  await addProductType("3 Name")
  await addProductType("4 Name")

  await addProduct("Twitter OG", 10)
  await addProduct("3 Name", 10)
  await addProduct("4 Name", 10)
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
