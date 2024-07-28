import { nanoid } from "nanoid"
import "server-only"

import { hashToken } from "./hash-token"

const PREFIX_TOKEN = "qrk_"

interface TokenResult {
  token: string
  hashedToken: string
  partialToken: string
}

/**
 * Creates a new token, hashes it, and returns the token, its hash, and a partial representation of the token.
 *
 * @returns {Promise<TokenResult>} A promise that resolves to an object containing the token, its hashed version, and a partial key.
 *
 * @throws {Error} Throws an error if token creation fails.
 */
export async function createTokenApi(): Promise<TokenResult> {
  try {
    const token = `${PREFIX_TOKEN}${nanoid(24)}`
    const hashedToken = await hashToken(token)
    const partialToken = `${token.slice(0, 3)}...${token.slice(-4)}`

    return { token, hashedToken, partialToken }
  } catch (error) {
    console.error("Error creating token:", error)
    throw new Error("Failed to create token")
  }
}
