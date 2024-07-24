import { NextResponse } from "next/server"

import { withAdmin } from "@/lib/auth"

import { getPermissionOptions } from "@/data/permission"

/**
 * Handles GET requests to retrieve permission options for a permissions multiple selector in the role page.
 *
 * This endpoint is intended for use in the admin tool only.
 *
 **/
export const GET = withAdmin(async ({ searchParams }) => {
  try {
    const search: string | undefined = searchParams["search"] || undefined

    const data = await getPermissionOptions(search)

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching permissions:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})
