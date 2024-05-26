import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      userId: number
      active: boolean
    } & DefaultSession["user"]
  }

  interface User extends Omit<DefaultUser, "id"> {
    userId: number
    active: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId: number
    active: boolean
  }
}
