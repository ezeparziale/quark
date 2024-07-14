import { NextResponse } from "next/server"

import { has } from "@/lib/rbac"

type Handler = (request: Request) => Promise<Response>

/**
 * Higher-order function to check if the user has an admin role before executing the handler.
 *
 * This function wraps the given handler and performs an authorization check. If the user is not authorized,
 * it returns a 401 Unauthorized response. If an error occurs during the authorization check, it returns a 500
 * Internal Server Error response.
 *
 * @param {Handler} handler - The request handler to be executed if the user is authorized.
 * @returns {Handler} - A new handler function that performs the authorization check before calling the original handler.
 *
 * @example
 * // Usage with a GET request handler
 * async function handler(request: Request): Promise<Response> {
 *   // Handler logic here
 * }
 * export const GET = withAdmin(handler);
 */
export function withAdmin(handler: Handler): Handler {
  return async (request: Request): Promise<Response> => {
    try {
      const isAuthorized = await has({ role: "admin" })
      if (!isAuthorized) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      }

      return handler(request)
    } catch (error) {
      console.error("Error in authorization check:", error)
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
  }
}
