import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized({ token }) {
      return token?.roles.includes("ADMIN") ?? false
    },
  },
})

export const config = {
  matcher: ["/admin/:path*"],
}
