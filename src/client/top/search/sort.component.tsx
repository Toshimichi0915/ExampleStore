import { css } from "@emotion/react"
import SortIcon from "@mui/icons-material/Sort"
import { SearchSortPopover } from "@/client/top/search/sort-popover.component"
import { useCallback, useRef, useState } from "react"

export function SearchSort({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>()
  const ref = useRef<HTMLDivElement>(null)

  const openPopover = useCallback(() => {
    setOpen(true)
    setAnchorEl(ref.current)
  }, [])

  const closePopover = useCallback(() => setOpen(false), [])

  return (
    <>
      <SearchSortPopover open={open} onClose={closePopover} anchorEl={anchorEl} />
      <div css={searchSortStyles} className={className} ref={ref}>
        <button className="SearchSort-Button" onClick={openPopover}>
          Sort <SortIcon />
        </button>
      </div>
    </>
  )
}

function searchSortStyles() {
  return css`
    & .SearchSort-Button {
      display: flex;
      align-items: center;
      gap: 5px;

      background-color: transparent;
      border: 0;
      font-size: 1.1rem;
      color: white;
    }
  `
}
