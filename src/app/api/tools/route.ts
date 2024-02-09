import { NextResponse } from "next/server"

import { toolsConfig } from "@/constants"

export async function GET(req: Request) {
  return NextResponse.json(toolsConfig, { status: 200 })
}
