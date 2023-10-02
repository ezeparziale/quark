import prismadb from "@/utils/prismadb"
import bcrypt from "bcrypt"
import { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const user = await prismadb.user.findUnique({
            where: {
              email: credentials.email,
            },
          })

          if (!user || !user?.hashedPassword) {
            return null
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.hashedPassword,
          )

          if (!isCorrectPassword) {
            return null
          }

          return user
        } catch (error) {
          return null
        }
      },
    }),
  ],
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
        const userExists = await prismadb.user.findUnique({
          where: {
            email: user?.email as string,
          },
        })

        if (userExists && userExists.confirmedEmail === false) {
          throw Error("ConfirmEmail")
        }

        if (userExists && userExists.active === false) {
          return false
        }
      }

      if (account?.type === "oauth") {
        const userExists = await prismadb.user.findUnique({
          where: {
            email: profile?.email,
          },
        })

        if (userExists && userExists.confirmedEmail === false) {
          throw Error("ConfirmEmail")
        }

        if (userExists && userExists.active === false) {
          return false
        }

        if (!userExists) {
          let username: string = (profile?.name as string).replace(" ", ".")

          while (true) {
            const usernameExists = await prismadb.user.findUnique({
              where: { username },
            })

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
              hashedPassword: "",
              active: true,
              confirmedEmail: true,
            },
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) token.active = user.active
      return token
    },
    async session({ session, user, token }) {
      if (session?.user) session.user.active = token.active
      return session
    },
  },
}
