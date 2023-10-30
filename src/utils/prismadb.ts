import { env } from "@/env.mjs"
import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

const prismadb =
  globalThis.prisma ||
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
if (env.NODE_ENV !== "production") globalThis.prisma = prismadb

export default prismadb
