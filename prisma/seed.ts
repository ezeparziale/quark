import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
async function main() {
  const permission = await prisma.permission.upsert({
    where: { name: "admin:all" },
    update: {},
    create: {
      name: "admin:all",
      description: "Admin permission",
    },
  })

  const role = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      description: "Admin role",
    },
  })

  await prisma.rolePermission.create({
    data: {
      permission: {
        connect: {
          id: permission.id,
        },
      },
      role: {
        connect: {
          id: role.id,
        },
      },
    },
  })

  console.log({ permission, role })
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
