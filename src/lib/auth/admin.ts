import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { type User } from "@prisma/client"
import "server-only"

import { has, userHasRequiredRole } from "@/lib/rbac"

import prismadb from "../prismadb"
import { hashToken } from "./hash-token"

interface ICurrentUser extends Pick<User, "id" | "email"> {}
interface IWithAdminHandler {
  ({
    req,
    context,
    currentUser,
  }: {
    req: Request
    context: { params: Record<string, string>; searchParams: Record<string, string> }
    currentUser: ICurrentUser
  }): Promise<Response>
}

const searchParamsToObject = (
  searchParams: URLSearchParams,
): Record<string, string> => {
  const params: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}

/**
 * Higher-order function to check if the user has an admin role before executing the handler.
 */
export const withAdmin =
  (handler: IWithAdminHandler) =>
  async (
    req: Request,
    { params }: { params: Promise<Record<string, string>> },
  ): Promise<Response> => {
    try {
      const resolvedParams = await params
      const searchParams = searchParamsToObject(new URL(req.url).searchParams)

      // Check header Authorization
      const authorizationHeader = req.headers.get("Authorization")

      if (authorizationHeader) {
        if (!authorizationHeader.startsWith("Bearer ")) {
          return NextResponse.json(
            { message: "Could not validate credentials" },
            { status: 401, headers: { "WWW-Authenticate": "Bearer" } },
          )
        }
        const apiKey = authorizationHeader.substring(7)
        const hashedToken = await hashToken(apiKey)
        const token = await prismadb.token.findUnique({
          where: { hashedToken },
          include: {
            user: { select: { id: true, email: true } },
            permissions: { include: { permission: true } },
          },
        })

        if (token) {
          let isAuthorized = false
          if (token.type === "custom") {
            isAuthorized = token.permissions.some((p) => p.permission.key === "admin")
          } else {
            isAuthorized = await userHasRequiredRole(token.userId, "admin")
          }

          if (!isAuthorized) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
          }

          const currentUser = { id: token.user.id, email: token.user.email }

          await prismadb.token.update({
            where: { hashedToken },
            data: { lastUsed: new Date() },
          })

          return handler({
            req,
            context: { params: resolvedParams, searchParams },
            currentUser,
          })
        } else {
          return NextResponse.json(
            { message: "Could not validate credentials" },
            { status: 401, headers: { "WWW-Authenticate": "Bearer" } },
          )
        }
      } else {
        // Check session data
        const isAuthorized = await has({ role: "admin" })
        if (!isAuthorized) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const session = await auth()
        const currentUser = { id: session?.user.userId!, email: session?.user.email! }

        return handler({
          req,
          context: { params: resolvedParams, searchParams },
          currentUser,
        })
      }
    } catch (error) {
      console.error("Error in authorization check:", error)
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
  }
