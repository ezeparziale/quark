import { env } from "@/env"
import { PrismaClient } from "@prisma/client"
import "server-only"

const globalForPrisma = global as unknown as { prismadb: PrismaClient }

export const prismadb =
  globalForPrisma.prismadb ||
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (env.NODE_ENV !== "production") globalForPrisma.prismadb = prismadb

export default prismadb
