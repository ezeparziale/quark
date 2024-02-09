import { NextResponse } from "next/server"
import type { NextFetchEvent, NextRequest } from "next/server"

import { getToken } from "next-auth/jwt"

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  const token = await getToken({ req })
  const isAuthenticated = !!token
  if (
    (req.nextUrl.pathname.startsWith("/auth/login") ||
      req.nextUrl.pathname.startsWith("/auth/register")) &&
    isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/tools", req.url))
  }
  if (req.nextUrl.pathname.startsWith("/auth/")) {
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/error).*)"],
}
