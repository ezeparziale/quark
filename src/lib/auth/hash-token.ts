import { createHash } from "crypto"
import "server-only"

export async function hashToken(token: string): Promise<string> {
  const hashedToken = createHash("sha256").update(token).digest("hex")
  return hashedToken
}
