import { NextResponse } from "next/server"

import { withAdmin } from "@/lib/auth"

import { getPermissionOptions } from "@/data/permission"

/**
 * Handles GET requests to retrieve permission options for a permissions multiple selector in the role page.
 *
 * This endpoint is intended for use in the admin tool only.
 *
 * @param request - The incoming request object.
 * @returns A promise that resolves to a response object with the permission options or an error message.
 *
 **/
async function handler(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || undefined

    const data = await getPermissionOptions(search)

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching permissions:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export const GET = withAdmin(handler)
