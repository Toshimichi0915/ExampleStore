import NextAuth, { AuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { User, UserRole } from "@prisma/client"
import { prisma } from "@/server/global.type"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      roles: UserRole[]
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    roles: UserRole[]
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "name" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null

        const { name, password } = credentials
        if (!name) return null
        if (!password) return null

        const user = await prisma.user.findUnique({ where: { name } })
        if (!user) return null

        const match = await bcrypt.compare(password, user.password ?? "")
        if (!match) return null

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (!user) return token

      return {
        ...token,
        id: user.id,
        roles: (user as User).roles,
      }
    },
    async session({ session, token }) {
      if (!token) return session

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          roles: token.roles,
        },
      }
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
} satisfies AuthOptions

export default NextAuth(authOptions)
