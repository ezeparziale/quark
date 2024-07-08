import { NextResponse } from "next/server"

import { has } from "@/lib/rbac"

import { getCurrentUser } from "@/actions/users/get-current-user"

import { getPermissionOptions } from "@/data/permission"

/**
 * Handles GET requests to retrieve permission options for a permissions multiple selector in the role page.
 **/
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || undefined

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const isAuthorized = await has({ role: "admin" })
    if (!isAuthorized) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await getPermissionOptions(search)

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching permissions:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
