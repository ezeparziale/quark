import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      active: boolean
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    active: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    active: boolean
  }
}
