import { env } from "@/env.mjs"
import bcrypt from "bcrypt"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

import { getUserByEmail } from "@/data/user"

import { authConfig } from "./auth.config"
import { loginSchema } from "./schemas/auth"

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        try {
          const parsedCredentials = loginSchema.safeParse(credentials)

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data
            const user = await getUserByEmail(email)

            if (!user || !user?.password) return null

            const passwordsMatch = await bcrypt.compare(password, user.password)

            if (passwordsMatch) return user
          }

          console.log("Invalid credentials")
          return null
        } catch {
          return null
        }
      },
    }),
  ],
})
