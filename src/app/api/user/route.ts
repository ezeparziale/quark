import { NextResponse } from "next/server"

import prismadb from "@/utils/prismadb"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { email } = body

    const userExists = await prismadb.user.findUnique({ where: { email } })

    if (!userExists) {
      return NextResponse.json({ error: "Email not exists" }, { status: 404 })
    }

    if (!userExists.active) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ message: "Email ok" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
