import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main(): Promise<void> {
  const name = process.argv[2]
  const password = process.argv[3]

  if (!name) {
    console.log("No username provided")
    return
  }

  if (!password) {
    console.log("No password provided")
    return
  }

  console.log(`Creating user ${name} with password ${password}`)

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
