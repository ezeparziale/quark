import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { type User } from "@prisma/client"
import "server-only"

import { has, userHasRequiredRole } from "@/lib/rbac"

import { getCurrentUser } from "@/actions/users/get-current-user"

import prismadb from "../prismadb"
import { getSearchParams } from "../utils"
import { hashToken } from "./hash-token"

interface ICurrentUser extends Pick<User, "id" | "email"> {}
interface IWithAdminHandler {
  ({
    req,
    params,
    searchParams,
    currentUser,
  }: {
    req: Request
    params: Record<string, string>
    searchParams: Record<string, string>
    currentUser: ICurrentUser
  }): Promise<Response>
}

/**
 * Higher-order function to check if the user has an admin role before executing the handler.
 *
 * This function wraps the given handler and performs an authorization check. If the user is not authorized,
 * it returns a 401 Unauthorized response. If an error occurs during the authorization check, it returns a 500
 * Internal Server Error response.
 *
 * @param {IWithAdminHandler} handler - The request handler to be executed if the user is authorized.
 * @returns {Handler} - A new handler function that performs the authorization check before calling the original handler.
 *
 * @example
 * // Usage with a GET request handler
 * async function handler({req, params, searchParams}): Promise<Response> {
 *   // Handler logic here
 * }
 * // Wrap the handler with withAdmin for admin role authorization:
 * export const GET = withAdmin(handler);
 */
export const withAdmin =
  (handler: IWithAdminHandler) =>
  async (
    req: Request,
    { params = {} }: { params: Record<string, string> | undefined },
  ): Promise<Response> => {
    try {
      const searchParams = getSearchParams(req.url)

      // Check header Authorization
      const authorizationHeader = req.headers.get("Authorization")

      if (authorizationHeader) {
        if (!authorizationHeader.includes("Bearer ")) {
          return NextResponse.json(
            { message: "Could not validate credentials" },
            { status: 401, headers: { "WWW-Authenticate": "Bearer" } },
          )
        }
        const apiKey = authorizationHeader.substring(7)
        const hashedToken = await hashToken(apiKey)
        const token = await prismadb.token.findUnique({
          where: { hashedToken },
          include: { user: { select: { id: true, email: true } } },
        })

        if (token) {
          const isAuthorized = await userHasRequiredRole(token.userId, "admin")

          if (!isAuthorized) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
          }

          const currentUser = { id: token.user.id, email: token.user.email }

          await prismadb.token.update({
            where: { hashedToken },
            data: { lastUsed: new Date() },
          })

          return handler({ req, params, searchParams, currentUser })
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

        return handler({ req, params, searchParams, currentUser })
      }
    } catch (error) {
      console.error("Error in authorization check:", error)
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
  }
