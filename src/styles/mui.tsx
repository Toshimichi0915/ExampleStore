import { Theme, css } from "@mui/material"
import { CSSInterpolation } from "@emotion/serialize"

type Styles = (theme: Theme) => CSSInterpolation

export const defaultTextAreaStyles: Styles = (theme: Theme) => css({
  background: "transparent",
  padding: "8.5px 14px",
  fontFamily: theme.typography.fontFamily,
  fontSize: "inherit",
  borderRadius: 4,
  border: `1px solid rgba(255, 255, 255, 0.23)`,
  outline: "none",
  color: theme.palette.text.primary,
  "&:hover": {
    border: `1px solid rgba(255, 255, 255, 0.87)`,
  },
  "&:focus": {
    border: `1px solid ${theme.palette.primary.main}`,
    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
  },
  "&::placeholder": {
    color: theme.palette.text.secondary,
  },
})

export const defaultPaperStyles: Styles = (theme: Theme) => css({
  padding: 20,
  borderRadius: 6,
  border: `1px solid ${theme.palette.border.paper}`,
})

export const defaultDialogStyles: Styles = (theme: Theme) =>
  css({
    "& .MuiDialog-paper": {
      padding: 10,
      borderRadius: 6,
      border: `1px solid ${theme.palette.border.paper}`,
    },
  })

export const defaultDialogTitleStyles: Styles = () => css({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  overflow: "visible",
})
