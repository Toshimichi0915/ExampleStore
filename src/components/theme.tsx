import { poppins } from "@/common/theme"
import { useTheme } from "@mui/material"

export function GlobalTheme() {
  const theme = useTheme()

  return (
    <style jsx global>{`
      html {
        color: white;
        font-family: ${poppins.style.fontFamily};
        background-color: ${theme.palette.background.default};
      }
    `}</style>
  )
}
