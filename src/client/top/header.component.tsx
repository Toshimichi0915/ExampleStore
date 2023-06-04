import { css, Theme } from "@mui/material"
import Link from "next/link"
import { Environment } from "@/common/db.type"
import TelegramIcon from "@mui/icons-material/Telegram"

export function Header({ environment }: { environment: Environment }) {
  return (
    <header css={headerStyles}>
      <div>
        <h1 className="Header-Title">Genshin Store</h1>
        <p className="Header-Description">Premium Twitter Accounts</p>
      </div>
      <div>
        <Link href={environment.telegramUrl} className="Header-Telegram">
          <TelegramIcon />
          <span className="Header-Telegram-Text">TELEGRAM</span>
        </Link>
      </div>
    </header>
  )
}

function headerStyles(theme: Theme) {
  return css`
    background-color: ${theme.palette.background.paper};
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
      background-color: #458efc;
      padding: 8px 11px;
      border-radius: 3px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: ${theme.palette.text.primary};
    }
  `
}
