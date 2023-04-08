import { defaultPaperStyles } from "@/styles/mui"
import { Button, TextField, Typography, css, useTheme } from "@mui/material"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { getCsrfToken } from "next-auth/react"

export default function Page({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const theme = useTheme()

  return (
    <div className="w-screen h-screen grid place-items-center">
      <main
        css={[defaultPaperStyles(theme), css({
          width: "80vw",
          padding: "30px",
          "@media (min-width: 768px)": {
            width: "400px",
          },
        })]}
      >
        <Typography variant="h1" sx={{ marginBottom: "30px" }}>
          Login
        </Typography>
        <form className="flex flex-col gap-6" method="post" action="/api/auth/callback/credentials">
          <TextField label="Username" name="name" />
          <TextField label="Password" name="password" type="password" />
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <Button
            type="submit"
            sx={{
              fontSize: "1rem",
              color: theme.palette.text.primary,
            }}
          >
            LOGIN
          </Button>
        </form>
      </main>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken },
  }
}
