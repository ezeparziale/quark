import { NextResponse } from "next/server"
import type { NextFetchEvent, NextRequest } from "next/server"

import { env } from "@/env.mjs"
import { getToken } from "next-auth/jwt"

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  const token = await getToken({ req })
  const isAuthenticated = !!token
  if (
    (req.nextUrl.pathname.startsWith("/auth/login") ||
      req.nextUrl.pathname.startsWith("/auth/register")) &&
    isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/", req.url))
  }
  if (req.nextUrl.pathname.startsWith("/auth/")) {
    return NextResponse.next()
  }

  if (isAuthenticated && token) {
    const resp = await fetch(`${env.NEXTAUTH_URL}/api/user`, {
      method: "POST",
      body: JSON.stringify({ email: token?.email }),
    })
    if (!resp.ok) {
      return NextResponse.redirect(
        `${env.NEXTAUTH_URL}/auth/logout/?callbackUrl=/auth/error/?error=AccessDenied`,
      )
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/error).*)"],
}
