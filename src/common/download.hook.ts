import { useCallback, useMemo } from "react"

interface Download {
  download(): void
}

export function useDownload(name: string, blob: Blob | undefined): Download {
  const download = useCallback(() => {
    if (!blob) return
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", name)

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [ name, blob ])

  return useMemo(() => ({
    download,
  }), [ download ])
}
