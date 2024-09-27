import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      userId: number
      isActive: boolean
      role: "admin" | "user"
    } & DefaultSession["user"]
  }

  interface User extends Omit<DefaultUser, "id"> {
    userId: number
    isActive: boolean
    role: "admin" | "user"
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId: number
    isActive: boolean
    role: "admin" | "user"
  }
}
