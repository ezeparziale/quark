import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const permission = await prisma.permission.upsert({
    where: { key: "admin:all" },
    update: {},
    create: {
      name: "Admin permission",
      description: "Permission to access the admin section",
      key: "admin:all",
    },
  })

  const role = await prisma.role.upsert({
    where: { key: "admin" },
    update: {},
    create: {
      name: "Admin",
      description: "Admin role",
      key: "admin",
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

  const tool = await prisma.tool.upsert({
    where: { name: "Admin" },
    update: {},
    create: {
      name: "Admin",
      href: "/admin",
      icon: "shield-check",
      description: "Admin tool",
    },
  })

  await prisma.roleTool.create({
    data: {
      tool: {
        connect: {
          id: tool.id,
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
