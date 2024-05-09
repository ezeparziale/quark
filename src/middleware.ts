import { authConfig } from "@/auth.config"
import NextAuth from "next-auth"

export const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isAuthenticated = !!req.auth

  if (
    (req.nextUrl.pathname.startsWith("/auth/login") ||
      req.nextUrl.pathname.startsWith("/auth/register")) &&
    isAuthenticated
  ) {
    return Response.redirect(new URL("/tools", req.url))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/error).*)"],
}
