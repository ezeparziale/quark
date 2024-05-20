import { env } from "@/env.mjs"
import bcrypt from "bcrypt"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

import { getUserByEmail } from "@/data/user"

import { authConfig } from "./auth.config"
import { loginSchema } from "./schemas/auth"

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
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
        } catch (error) {
          return null
        }
      },
    }),
  ],
})
