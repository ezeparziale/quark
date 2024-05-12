import { env } from "@/env.mjs"
import bcrypt from "bcrypt"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

import { getUserByEmail } from "@/data/user"

import { authConfig } from "./auth.config"

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
          if (!credentials?.email || !credentials?.password) return null

          const user = await getUserByEmail(credentials.email as string)

          if (!user || !user?.password) return null

          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            user.password,
          )

          if (passwordsMatch) return user

          return null
        } catch (error) {
          return null
        }
      },
    }),
  ],
})
