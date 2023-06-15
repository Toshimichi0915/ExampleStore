import { Environment, Product } from "@/common/db.type"
import { dialogStyles } from "@/client/common/styles"
import { Checkbox, Dialog, DialogContent, DialogTitle, TextareaAutosize, Theme } from "@mui/material"
import { css } from "@emotion/react"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import TelegramIcon from "@mui/icons-material/Telegram"
import { usePurchase } from "@/client/top/purchase.hook"
import { ChangeEvent, MouseEvent, useCallback, useState } from "react"
import Link from "next/link"

export function ProductDialog({
  product,
  open,
  onClose,
  className,
  environment,
}: {
  product: Product
  open: boolean
  onClose: () => void
  className?: string
  environment: Environment
}) {
  const [checked, setChecked] = useState(false)

  const updateChecked = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked)
  }, [])

  const { purchase } = usePurchase(product)

  const onPurchase = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (!checked) return
      e.preventDefault()
      purchase()
    },
    [checked, purchase]
  )

  const onContact = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (!checked) return
      e.preventDefault()
      window.open(environment.telegramUrl, "_blank")
    },
    [checked, environment.telegramUrl]
  )

  const notes = []
  if (product.unswappable) notes.push("This product cannot be swapped to other accounts")
  if (product.hasOriginalMail) notes.push("This product contains an original email")

  return (
    <Dialog css={[dialogStyles, productDialogStyles]} className={className} open={open} onClose={onClose}>
      <DialogTitle className="ProductDialog-Title">
        <span>{product.name}</span>
        <span>${product.price}</span>
      </DialogTitle>
      <DialogContent>
        {notes.length > 0 && (
          <div className="ProductDialog-Note">
            {notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        )}
        {product.note && (
          <div className="ProductDialog-NoteContainer">
            <TextareaAutosize className="ProductDialog-Note" value={product.note} disabled={true} />
          </div>
        )}
        <form className="ProductDialog-Form">
          <label className="ProductDialog-Tos">
            <p>
              You must agree our
              <Link href="/tos" className="ProductDialog-TosLink">
                Terms of Service
              </Link>
              to purchase this product
            </p>
            <Checkbox required={true} checked={checked} onChange={updateChecked} />
          </label>
          <div className="ProductDialog-Buttons">
            <button className="ProductDialog-Button" onClick={onPurchase}>
              Pay with coinbase
              <ShoppingCartIcon />
            </button>
            <button className="ProductDialog-Button" onClick={onContact}>
              Contact us for other options
              <TelegramIcon />
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function productDialogStyles(theme: Theme) {
  return css`
    & .MuiDialog-paper {
      min-width: min(80vw, 800px);
      background-color: ${theme.palette.background.default};
      background-image: none;
    }

    & .ProductDialog-Title {
      display: flex;
      justify-content: space-between;
    }

    & .ProductDialog-NoteContainer {
      background-color: ${theme.palette.background.paper};
      padding: 16px 20px;
    }

    & .ProductDialog-Note {
      border-radius: 3px;
      background-color: transparent;
      width: 100%;
      font-family: ${theme.typography.fontFamily};
      font-size: ${theme.typography.body1.fontSize};
      color: ${theme.palette.text.primary};
      outline: none;
      border: none;
      resize: none;
    }

    & .ProductDialog-Form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 20px;
    }

    & .ProductDialog-Tos {
      display: flex;
      align-items: center;
      justify-content: end;
      font-size: 0.9rem;
    }

    & .ProductDialog-TosLink {
      text-decoration: none;
      color: ${theme.palette.primary.main};
      margin: 0 5px;
    }

    & .ProductDialog-Buttons {
      display: flex;
      gap: 20px;
      flex-direction: column;

      @media (min-width: 768px) {
        flex-direction: row;
      }
    }

    & .ProductDialog-Button {
      flex: 1;
      border: 2px solid ${theme.palette.primary.main};
      color: ${theme.palette.primary.main};
      background-color: transparent;
      font-family: ${theme.typography.fontFamily};
      font-size: 0.9rem;
      border-radius: 6px;
      transition: all 0.3s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 20px;
      min-height: 3rem;

      &:hover {
        background-color: white;
        border-color: black;
        color: black;
        cursor: pointer;
      }

      @media (min-width: 768px) {
        min-height: unset;
        justify-content: center;
        gap: 20px;
      }
    }
  `
}
