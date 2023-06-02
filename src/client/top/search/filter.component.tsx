import { ProductType } from "@/common/db.type"
import { useProductTypes } from "@/client/top/search/product-type.hook"
import { useCallback, useRef, useState } from "react"
import { SearchFilterPopover } from "@/client/top/search/filter-popover.component"
import { css } from "@emotion/react"
import FilterListIcon from "@mui/icons-material/FilterList"

export function SearchFilter({
  className,
  productTypes: initialProductTypes,
}: {
  className?: string
  productTypes: ProductType[]
}) {
  const productTypes = useProductTypes(initialProductTypes)

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
      <SearchFilterPopover productTypes={productTypes} open={open} onClose={closePopover} anchorEl={anchorEl} />
      <div css={searchFilterStyles} className={className} ref={ref}>
        <button className="SearchFilterStyles-Button" onClick={openPopover}>
          Filter <FilterListIcon />
        </button>
      </div>
    </>
  )
}

function searchFilterStyles() {
  return css`
    & .SearchFilterStyles-Button {
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
