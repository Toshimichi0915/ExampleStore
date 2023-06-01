import { Popover } from "@mui/material"
import { sortOptions } from "@/common/search.type"
import { css } from "@emotion/react"
import { SearchSortPopoverButton } from "@/client/top/search/search-popover-button.component"

const anchorOrigin = {
  vertical: "bottom",
  horizontal: "left",
} as const

export function SearchSortPopover({ className, open, onClose, anchorEl }: {
  className?: string,
  open: boolean,
  onClose: () => void,
  anchorEl: Element | null | undefined
}) {

  return (
    <Popover open={open} onClose={onClose} anchorEl={anchorEl} className={className} css={searchSortPopoverStyles}
             anchorOrigin={anchorOrigin}>
      {sortOptions.map((option) => (
        <SearchSortPopoverButton key={option} sort={option} />
      ))}
    </Popover>
  )
}

function searchSortPopoverStyles() {
  return css`
    & .MuiPopover-paper {
      display: flex;
      flex-direction: column;
      padding: 8px;
      gap: 10px;
      border-radius: 7px;
    }
  `
}
