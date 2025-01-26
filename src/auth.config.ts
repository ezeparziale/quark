import type { NextAuthConfig } from "next-auth"

import prismadb from "@/lib/prismadb"

import { getUserByEmail, getUserByUsername } from "@/data/user"

import { logActivity } from "./lib/activity"
import { ActivityType } from "./schemas/activity-logs"

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
    async signIn({ user, account, profile }) {
      if (account?.type === "credentials") {
        const userExists = await getUserByEmail(user?.email as string)

        if (userExists && userExists.emailVerified === false)
          throw Error("ConfirmEmail")

        if (userExists && userExists.isActive === false) return false
      }

      if (account?.provider === "google" || account?.provider === "github") {
        const userExists = await getUserByEmail(profile?.email as string)

        if (userExists && userExists.emailVerified === false) {
          throw Error("ConfirmEmail")
        }

        if (userExists && userExists.isActive === false) return false

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

          const user = await prismadb.user.create({
            data: {
              username,
              email: profile?.email as string,
              isActive: true,
              emailVerified: true,
              image: profile?.picture ?? profile?.avatar_url,
            },
          })
          await logActivity(user.id, ActivityType.SIGN_UP)
        } else {
          const user = await prismadb.user.update({
            where: { email: profile?.email as string },
            data: {
              image: profile?.picture ?? profile?.avatar_url,
            },
          })
          await logActivity(user.id, ActivityType.SIGN_IN)
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        if (user?.email) {
          const userExists = await getUserByEmail(user?.email)

          if (userExists) {
            token.userId = userExists.id
            token.isActive = userExists.isActive
            token.role = userExists.isAdmin ? "admin" : "user"
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.userId = token.userId
        session.user.isActive = token.isActive
        session.user.role = token.role
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig
