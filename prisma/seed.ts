import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const name = "placeholder"
const password = "De1eteMe"

async function main(): Promise<void> {
  await prisma.user.upsert({
    where: { name },
    update: {
      name: name,
      password: await bcrypt.hash(password, 10),
      roles: ["ADMIN"],
    },
    create: {
      name: name,
      password: await bcrypt.hash(password, 10),
      roles: ["ADMIN"],
    },
  })
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
