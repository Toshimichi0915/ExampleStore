import { GetServerSidePropsContext } from "next"
import { getCsrfToken } from "next-auth/react"
import { LoginPage } from "@/client/login/login.page"

export default LoginPage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken },
  }
}
