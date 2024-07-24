import { NextResponse } from "next/server"

import { document } from "@/lib/openapi"

export function GET() {
  return NextResponse.json({ ...document })
}
