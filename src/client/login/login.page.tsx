import { Button, css, TextField, Theme } from "@mui/material"
import { paperStyles } from "@/client/common/styles"
import { InferGetServerSidePropsType } from "next"
import { getServerSideProps } from "@/pages/login"

export function LoginPage({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  return (
    <div css={loginPageStyles}>
      <main css={[ paperStyles ]} className="Container">
        <h1 className="Title">Login</h1>
        <form className="Form" method="post" action="/api/auth/callback/credentials">
          <TextField label="Username" name="name" />
          <TextField label="Password" name="password" type="password" />
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <Button type="submit" className="Submit">LOGIN</Button>
        </form>
      </main>
    </div>
  )
}

function loginPageStyles(theme: Theme) {
  return css`
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;

    & .Container {
      width: 80vw;
      padding: 30px;
      @media (min-width: 768px) {
        width: 400px;
      }
    }

    & .Title {
      margin: 0 0 30px 0;
    }

    & .Form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    & .Submit {
      font-size: 1rem;
      color: ${theme.palette.text.primary}
    }
  `
}
