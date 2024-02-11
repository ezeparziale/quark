import { NextResponse } from "next/server"

import { TOOLS } from "@/utils"

export async function GET(req: Request) {
  return NextResponse.json(TOOLS, { status: 200 })
}
