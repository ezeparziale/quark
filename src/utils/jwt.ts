import jwt from "jsonwebtoken"

type UserToken = {
  email: string
  iat: number
  exp: number
}

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string
const JWT_EXPIRED_IN = Number(process.env.JWT_EXPIRED_IN)

export function verify_user_token(token: string) {
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY) as UserToken
    const userEmail = decodedToken.email
    return userEmail
  } catch (error) {
    return false
  }
}

export function generate_user_token(email: string): string {
  const token: string = jwt.sign({ email }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRED_IN,
  })
  return token
}
