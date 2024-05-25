import type { NextAuthConfig } from "next-auth"

import prismadb from "@/lib/prismadb"

import { getUserByEmail, getUserByUsername } from "@/data/user"

export const authConfig = {
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    newUser: "/auth/register",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //30 days
    updateAge: 24 * 60 * 60, //24 hours
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.type === "credentials") {
        const userExists = await getUserByEmail(user?.email as string)

        if (userExists && userExists.confirmedEmail === false)
          throw Error("ConfirmEmail")

        if (userExists && userExists.active === false) return false
      }

      if (account?.provider === "google") {
        const userExists = await getUserByEmail(profile?.email as string)

        if (userExists && userExists.confirmedEmail === false) {
          throw Error("ConfirmEmail")
        }

        if (userExists && userExists.active === false) return false

        if (!userExists) {
          let username: string = (profile?.name as string).replace(" ", ".")

          while (true) {
            const usernameExists = await getUserByUsername(username)

            if (usernameExists) {
              username = username + "." + Math.floor(Math.random() * 100000)
            } else {
              break
            }
          }

          const newUser = await prismadb.user.create({
            data: {
              username,
              email: profile?.email as string,
              active: true,
              confirmedEmail: true,
            },
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        if (user?.email) {
          const userExists = await getUserByEmail(user?.email)

          if (userExists) {
            token.id = userExists.id
            token.active = userExists.active
          }
        }
      }
      return token
    },
    async session({ session, user, token }) {
      if (token) {
        session.user.id = token.id
        session.user.active = token.active
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig
