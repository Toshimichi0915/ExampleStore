import { css } from "@emotion/react"
import { Theme } from "@mui/material"
import Link from "next/link"
import { memo } from "react"

export const Footer = memo(function Footer() {
  return (
    <footer css={footerStyles}>
      <p className="Footer-Text Footer-Copyright">© 2023 Example Store</p>
      <Link href="/tos" className="Footer-Text Footer-Tos">
        Terms of service
      </Link>
    </footer>
  )
})

function footerStyles(theme: Theme) {
  return css`
    padding: 20px;
    background-color: ${theme.palette.background.paper};

    display: flex;
    gap: 40px;
    justify-content: end;

    & .Footer-Text {
      margin: 0;
      text-decoration: none;
      color: ${theme.palette.text.primary};
    }

    & .Footer-Tos {
      &:hover {
        color: ${theme.palette.primary.main};
      }
    }
  `
}
