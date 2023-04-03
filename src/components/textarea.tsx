import {
  styled,
  TextareaAutosize as MuiTextareaAutosize,
  TextareaAutosizeProps as MuiTextareaAutosizeProps,
} from "@mui/material"

const StyledTextareaAutosize = styled(MuiTextareaAutosize)<MuiTextareaAutosizeProps>(({ theme }) => ({
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
}))

export function TextareaAutosize(props: MuiTextareaAutosizeProps) {
  return <StyledTextareaAutosize {...props} />
}
