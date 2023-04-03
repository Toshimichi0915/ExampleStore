import { Paper as MuiPaper, PaperProps as MuiPaperProps, styled } from "@mui/material"
import { ElementType } from "react"

// https://github.com/mui/material-ui/issues/32392
type PaperProps = MuiPaperProps & {
  component?: ElementType
}

const StyledPaper = styled(MuiPaper)<PaperProps>(({ theme }) => ({
  padding: 20,
  borderRadius: 6,
  border: `1px solid ${theme.palette.border.paper}`,
}))

export function Paper(props: PaperProps) {
  return <StyledPaper {...props} />
}
