import "server-only"

import prismadb from "./prismadb"

export async function logActivity(userId: number, action: string) {
  await prismadb.activityLog.create({
    data: {
      userId,
      action,
    },
  })
}
