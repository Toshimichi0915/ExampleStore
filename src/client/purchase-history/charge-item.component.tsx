import { Charge } from "@/common/db.type"
import Link from "next/link"
import { css, Theme } from "@mui/material"

export function ChargeItem({ charge, className }: { charge: Charge; className?: string }) {
  return (
    <Link href={`/products/${charge.productId}`} css={chargeItemStyles} className={className}>
      <div className="ChargeItem-Container">
        <p className="ChargeItem-ProductName">{charge.product.name}</p>
        <p className="ChargeItem-ChargeStatus">{charge.status}</p>
      </div>
    </Link>
  )
}

function chargeItemStyles(theme: Theme) {
  return css`
    text-decoration: none;

    & .ChargeItem-Container {
      display: flex;
      justify-content: space-between;
      color: white;
      border-radius: 4px;
      padding: 10px 15px;
      transition: background-color 0.2s;

      &:hover {
        background-color: ${theme.palette.background.light};
      }
    }

    & .ChargeItem-ProductName {
      margin: 0;
    }

    & .ChargeItem-ChargeStatus {
      margin: 0;
    }
  `
}
