import { Charge } from "@/common/db.type"
import { TextareaAutosize, Theme } from "@mui/material"
import Link from "next/link"
import { css } from "@emotion/react"
import { paperStyles } from "@/client/common/styles"
import { ReactNode, useMemo } from "react"
import { useInvoice } from "@/client/payments/invoice.hook"
import DownloadIcon from "@mui/icons-material/Download"
import { useProductContent } from "@/client/payments/purchased-product.hook"
import { useDownload } from "@/common/download.hook"

export function PaymentCard({
  className,
  title,
  description,
  children,
}: {
  className?: string
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <section className={className} css={[paperStyles, paymentCardStyles]}>
      <h2 className="PaymentCard-Title">{title}</h2>
      <p className="PaymentCard-Description">{description}</p>
      {children}
    </section>
  )
}

export function PaymentUrlCard({ charge }: { charge: Charge }) {
  return (
    <PaymentCard title="Payment" description="Click the URL shown below">
      <div css={paymentUrlCardStyles}>
        <Link
          href={charge.chargeUrl ?? ""}
          className="PaymentUrlCard-ChargeUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          {charge.chargeUrl}
        </Link>
        <p className="PaymentUrlCard-Description">(Redirects to coinbase payment URL)</p>
      </div>
    </PaymentCard>
  )
}

export function InvoiceCard({ charge }: { charge: Charge }) {
  const invoice = useInvoice(charge)

  return (
    <PaymentCard title="Download Invoice" description="Click the icon to download the invoice">
      <div css={invoiceCardStyles}>
        <div className="InvoiceCard-Button" onClick={invoice.download}>
          <DownloadIcon className="InvoiceCard-Button-Icon" />
          <span className="InvoiceCard-Button-Text">Click here!</span>
        </div>
      </div>
    </PaymentCard>
  )
}

export function DownloadCard({ charge }: { charge: Charge }) {
  const { product, loading } = useProductContent(charge)
  const blob = useMemo(() => {
    if (typeof Blob === "undefined") return undefined
    if (!product) return undefined
    return new Blob([product.content], { type: "plain/text" })
  }, [product])

  const { download } = useDownload(`${product?.name ?? "product"}.txt`, blob)

  return (
    <PaymentCard title="Download Product" description="Click the icon to download the product">
      <div css={downloadCardStyles}>
        <div className="DownloadCard-Button" onClick={download}>
          <DownloadIcon className="DownloadCard-Button-Icon" />
          <span className="DownloadCard-Button-Text">{loading ? "Loading..." : "Click here!"}</span>
        </div>
      </div>
    </PaymentCard>
  )
}

export function PreviewCard({ charge }: { charge: Charge }) {
  const { product, loading } = useProductContent(charge)

  return (
    <PaymentCard title="Preview" description="You can preview the product content">
      <div css={previewCardStyles}>
        <TextareaAutosize
          value={loading ? "Loading..." : product?.content}
          readOnly={true}
          className="PreviewCard-Textarea"
        />
      </div>
    </PaymentCard>
  )
}

function paymentCardStyles() {
  return css`
    margin-top: 40px;
    margin-bottom: 60px;

    & .PaymentCard-Title {
      margin: 0;
    }

    & .PaymentCard-Description {
      margin: 0;
    }
  `
}

function paymentUrlCardStyles(theme: Theme) {
  return css`
    padding: 20px 0;

    & .PaymentUrlCard-ChargeUrl {
      text-align: center;
      display: block;
      text-decoration: none;
      color: ${theme.palette.info.light};

      &:hover {
        text-decoration: underline;
      }
    }

    & .PaymentUrlCard-Description {
      text-align: center;
    }
  `
}

function invoiceCardStyles(theme: Theme) {
  return css`
    display: grid;
    place-items: center;

    & .InvoiceCard-Button {
      display: flex;
      align-items: center;
      flex-direction: row;
      padding: 20px 0;
      cursor: pointer;

      transition: color 0.2s ease-in-out;

      &:hover {
        color: ${theme.palette.info.light};
      }
    }

    & .InvoiceCard-Button-Icon {
      font-size: 2rem;
    }

    & .InvoiceCard-Button-Text {
      font-size: 1.25rem;
    }
  `
}

function downloadCardStyles(theme: Theme) {
  return css`
    display: grid;
    place-items: center;

    & .DownloadCard-Button {
      display: flex;
      align-items: center;
      flex-direction: row;
      padding: 20px 0;
      cursor: pointer;

      transition: color 0.2s ease-in-out;

      &:hover {
        color: ${theme.palette.info.light};
      }
    }

    & .DownloadCard-Button-Icon {
      font-size: 2rem;
    }

    & .DownloadCard-Button-Text {
      font-size: 1.25rem;
    }
  `
}

function previewCardStyles(theme: Theme) {
  return css`
    padding-top: 10px;

    & .PreviewCard-Textarea {
      width: 100%;
      background-color: #000020;
      border: 1px solid #313a53;
      border-radius: 3px;
      color: white;
      padding: 10px;
      font-family: ${theme.typography.fontFamily};
      outline: none;
      resize: none;
    }
  `
}
