import {
  Dialog as MuiDialog,
  DialogContent as MuiDialogContent,
  DialogContentProps as MuiDialogContentProps,
  DialogProps as MuiDialogProps,
  DialogTitle as MuiDialogTitle,
  DialogTitleProps as MuiDialogTitleProps,
  styled,
} from "@mui/material"

const StyledDialog = styled(MuiDialog)<MuiDialogProps>(({ theme }) => ({
  "& .MuiDialog-paper": {
    padding: 10,
    borderRadius: 6,
    border: `1px solid ${theme.palette.border.paper}`,
  },
}))

export function Dialog(props: MuiDialogProps) {
  return <StyledDialog {...props} />
}

const StyledDialogTitle = styled(MuiDialogTitle)<MuiDialogTitleProps>(() => ({}))

export function DialogTitle(props: MuiDialogTitleProps) {
  return <StyledDialogTitle {...props} />
}

const StyledDialogContent = styled(MuiDialogContent)<MuiDialogContentProps>(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  overflow: "visible",
}))

export function DialogContent(props: MuiDialogContentProps) {
  return <StyledDialogContent {...props} />
}
