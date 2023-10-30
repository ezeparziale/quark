import { env } from "@/env.mjs"
import jwt from "jsonwebtoken"

type UserToken = {
  email: string
  iat: number
  exp: number
}

export function verify_user_token(token: string) {
  try {
    const decodedToken = jwt.verify(token, env.JWT_SECRET_KEY) as UserToken
    const userEmail = decodedToken.email
    return userEmail
  } catch (error) {
    return false
  }
}

export function generate_user_token(email: string): string {
  const token: string = jwt.sign({ email }, env.JWT_SECRET_KEY, {
    expiresIn: env.JWT_EXPIRED_IN,
  })
  return token
}
