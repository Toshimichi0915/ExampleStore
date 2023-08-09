import { memo, useCallback } from "react"
import { dialogStyles } from "@/client/common/styles"
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material"

export const ConfirmDialog = memo(function ConfirmDialog({
  className,
  open,
  onClose,
  onConfirm,
  title,
}: {
  className?: string
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
}) {
  const clickConfirm = useCallback(() => {
    onConfirm()
    onClose()
  }, [onConfirm, onClose])

  return (
    <Dialog open={open} onClose={onClose} css={dialogStyles} className={className}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Button onClick={clickConfirm}>YES</Button>
      </DialogContent>
    </Dialog>
  )
})
