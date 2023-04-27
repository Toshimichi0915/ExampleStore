import { css, Theme } from "@mui/material"
import Link from "next/link"
import Image from "next/image"

export function Header() {

  return (
    <header css={headerStyles}>
      <div>
        <h1 className="Header-Title">Genshin Store</h1>
        <p className="Header-Description">Premium Twitter Accounts</p>
      </div>
      <div>
        <Link
          href="https://example.com"
          className="Header-Telegram"
        >
          <Image src="/telegram.svg" alt="" width={16} height={16} />
          <span className="Header-Telegram-Text">TELEGRAM</span>
        </Link>
      </div>
    </header>
  )
}

function headerStyles(theme: Theme) {
  return css`
    background-color: ${theme.palette.background.light};
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 30px;

    @media (min-width: 768px) {
      padding: 40px 100px;
    }
    @media (min-width: 1024px) {
      padding: 40px 200px;
    }
    @media (min-width: 1280px) {
      padding: 40px calc((100vw - 1024px) / 2);
    }

    & .Header-Title {
      margin: 0;
    }

    & .Header-Description {
      font-size: 1.4rem;
      margin: 0;
    }

    & .Header-Telegram {
      background-color: #458EFC;
      padding: 8px 11px;
      border-radius: 3px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    & .Header-Telegram-Text {
      color: white;
    }
  `
}
