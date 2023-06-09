import { useCallback, useMemo } from "react"
import { Charge } from "@/common/db.type"
import jsPDF from "jspdf"
import { useFont } from "@/client/payments/font.hook"

const labelColor = "#313A53"
const valueColor = "#000000"

interface Invoice {
  download(): void
}

export function useInvoice(charge: Charge): Invoice {
  const poppins = useFont("Poppins-Regular", "/fonts/Poppins-Regular.ttf")
  const poppinsMedium = useFont("Poppins-Medium", "/fonts/Poppins-Medium.ttf")

  const download = useCallback(async () => {
    const pdf = new jsPDF({
      orientation: "p",
      unit: "px",
      format: "a4",
    })

    // add fonts
    await Promise.all([poppins.install(pdf), poppinsMedium.install(pdf)])

    // title
    pdf.setFont(poppinsMedium.name)
    pdf.setFontSize(24)
    pdf.setTextColor(labelColor)
    pdf.text(`Invoice for ${charge.product.name}`, 30, 30)

    // row (product)
    pdf.setFontSize(20)
    pdf.text("Product", 30, 70)

    // labels
    pdf.setFont(poppins.name)
    pdf.setFontSize(18)
    pdf.text("Name", 30, 95)
    pdf.text("Price", 30, 115)
    pdf.text("Type", 30, 135)

    // values
    pdf.setTextColor(valueColor)
    const name = charge.product.name
    const price = `$${charge.product.price}`
    const type = charge.product.type ?? "Unknown"
    pdf.text(name, 410 - pdf.getTextWidth(name), 95)
    pdf.text(price, 410 - pdf.getTextWidth(price), 115)
    pdf.text(type, 410 - pdf.getTextWidth(type), 135)

    // row (info)
    pdf.setFont(poppinsMedium.name)
    pdf.setFontSize(20)
    pdf.setTextColor(labelColor)
    pdf.text("Info", 30, 170)

    // labels
    pdf.setFont(poppins.name)
    pdf.setFontSize(18)
    pdf.text("Charge ID", 30, 195)
    pdf.text("URL", 30, 215)

    // values
    pdf.setTextColor(valueColor)
    const id = charge.id
    const baseUrl = typeof window === "undefined" ? "" : window.location.origin
    const url = `${baseUrl}/charges/${charge.id}`
    const clickNavigation = "(Click to open in browser)"
    pdf.text(id, 410 - pdf.getTextWidth(id), 195)
    pdf.textWithLink(clickNavigation, 410 - pdf.getTextWidth(clickNavigation), 215, { url })

    // note title
    pdf.setFont(poppinsMedium.name)
    pdf.setFontSize(20)
    pdf.setTextColor(labelColor)
    pdf.text("Note", 30, 530)

    // note
    pdf.setFont(poppins.name)
    pdf.setFontSize(16)
    pdf.setTextColor(valueColor)

    const text =
      "It might take a while for the transaction to be processed. If the payment does not complete in 24 hours, please contact us via Telegram (Click this message to open in browser)."
    const telegram = "https://t.me/example"
    const split = pdf.splitTextToSize(text, 350)
    pdf.textWithLink(split, 30, 555, { url: telegram })

    pdf.save("invoice.pdf")
  }, [poppins, poppinsMedium, charge])

  return useMemo(
    () => ({
      download,
    }),
    [download]
  )
}
