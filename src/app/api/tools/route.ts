import { NextResponse } from "next/server"

import { getCurrentUser } from "@/actions/users/get-current-user"
import { getUserTools } from "@/data/user"

export async function GET() {
  const currentUser = await getCurrentUser()

  if (currentUser) {
    const data = await getUserTools(currentUser.id)

    return NextResponse.json(data, { status: 200 })
  }

  return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
}
