import { Popover } from "@mui/material"
import { css } from "@emotion/react"
import { useProductTypes } from "@/client/top/search/product-type.hook"
import { ProductType } from "@/common/db.type"
import { SearchFilterPopoverButton } from "@/client/top/search/filter-popover-button.component"

const anchorOrigin = {
  vertical: "bottom",
  horizontal: "left",
} as const

export function SearchFilterPopover({ className, productTypes: initialProductTypes, open, onClose, anchorEl }: {
  className?: string
  productTypes: ProductType[]
  open: boolean,
  onClose: () => void,
  anchorEl: Element | null | undefined
}) {

  const types = useProductTypes(initialProductTypes)

  return (
    <Popover open={open} onClose={onClose} anchorEl={anchorEl} className={className} css={searchFilterPopoverStyles}
             anchorOrigin={anchorOrigin}>
      {types.map((type) => (
        <SearchFilterPopoverButton type={type} key={type.name} />
      ))}
    </Popover>
  )
}

function searchFilterPopoverStyles() {
  return css`
    & .MuiPopover-paper {
      display: flex;
      flex-direction: column;
      padding: 8px;
      gap: 10px;
      border-radius: 7px;
      background-image: none;
  `
}
