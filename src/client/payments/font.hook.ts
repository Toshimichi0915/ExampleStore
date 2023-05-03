import jsPDF from "jspdf"
import { useCallback, useMemo } from "react"

export interface Font {
  name: string,

  install(pdf: jsPDF): Promise<void>
}

async function loadFont(path: string): Promise<ArrayBuffer> {
  if (typeof window === "undefined") return Promise.resolve(new ArrayBuffer(0))
  const response = await fetch(path)
  if (!response.ok) throw new Error(`Failed to fetch font: ${response.statusText}`)
  return await response.arrayBuffer()
}

export function useFont(name: string, path: string, style?: string): Font {

  const promise = useMemo(() => loadFont(path), [ path ])
  const install = useCallback(async (pdf: jsPDF) => {

    let data: ArrayBuffer
    try {
      data = await promise
    } catch (e) {
      console.error(e)
      return
    }

    const fileName = name + ".ttf"
    pdf.addFileToVFS(fileName, Buffer.from(data).toString("base64"))
    pdf.addFont(fileName, name, style ?? "normal")
  }, [ name, promise, style ])

  return useMemo(() => ({
    name,
    install,
  }), [ name, install ])
}
