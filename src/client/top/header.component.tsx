import { css, Theme } from "@mui/material"
import Link from "next/link"
import { Environment } from "@/common/db.type"
import TelegramIcon from "@mui/icons-material/Telegram"
import CellTowerIcon from "@mui/icons-material/CellTower"
import EmailIcon from "@mui/icons-material/Email"
import CampaignIcon from "@mui/icons-material/Campaign"

export function Header({ environment }: { environment: Environment }) {
  return (
    <header css={headerStyles}>
      <div>
        <h1 className="Header-Title">Genshin Store</h1>
        <p className="Header-Description">Premium Twitter Accounts</p>
      </div>
      <div className="Header-Social">
        <Link href={environment.telegramUrl} className="Header-Telegram Header-SocialIcon">
          <TelegramIcon />
          <span className="Header-Telegram-Text">TELEGRAM</span>
        </Link>
        <Link href={environment.channelUrl} className="Header-Channel Header-SocialIcon">
          <CellTowerIcon />
          <span className="Header-Telegram-Text">CHANNEL</span>
        </Link>
        <Link href={`mailto:${environment.email}`} className="Header-Email Header-SocialIcon">
          <EmailIcon />
          <span className="Header-Telegram-Text">EMAIL</span>
        </Link>
      </div>
      {environment.campaign && (
        <div className="Header-Campaign">
          <CampaignIcon />
          {environment.campaign}
        </div>
      )}
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

    & .Header-Social {
      display: flex;
      gap: 20px;
    }

    & .Header-SocialIcon {
      display: flex;
      padding: 8px 11px;
      border-radius: 3px;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 150px;
      text-decoration: none;
      color: ${theme.palette.text.primary};

      box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.12), 0 2px 3px 0 rgba(0, 0, 0, 0.22);
      transition: 0.3s;

      &:hover {
        box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.15), 0 0 5px rgba(0, 0, 0, 0.1);
        transform: translateY(-4px);
      }
    }

    & .Header-Telegram {
      background-color: #458efc;
    }

    & .Header-Channel {
      background-color: #e87929;
    }

    & .Header-Email {
      background-color: #de3791;
    }

    & .Header-Campaign {
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: rgba(0, 0, 0, 0.4);
      padding: 10px 15px;
      border-radius: 3px;
    }
  `
}
