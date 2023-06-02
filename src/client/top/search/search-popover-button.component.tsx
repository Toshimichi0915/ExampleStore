import { SortOption } from "@/common/search.type"
import { useSearchInputStore } from "@/client/top/search-input.store"
import { useCallback, useMemo } from "react"
import { css } from "@emotion/react"
import { Theme } from "@mui/material"

export function SearchSortPopoverButton({ className, sort }: { className?: string; sort: SortOption }) {
  const [currentSort, setCurrentSort] = useSearchInputStore((state) => [state.sort, state.setSort])
  const selected = currentSort === sort

  const updateCurrentSort = useCallback(() => {
    setCurrentSort(sort)
  }, [setCurrentSort, sort])

  const classNames = useMemo(() => {
    const values = ["SearchSortPopoverButton"]

    if (selected) {
      values.push("SearchSortPopoverButton-Selected")
    }

    if (className) {
      values.push(className)
    }

    return values
  }, [className, selected])

  return (
    <button css={searchSortPopoverButtonStyles} className={classNames.join(" ")} onClick={updateCurrentSort}>
      {sort.charAt(0).toUpperCase() + sort.slice(1)}
    </button>
  )
}

function searchSortPopoverButtonStyles(theme: Theme) {
  return css`
    font-family: ${theme.typography.fontFamily};
    font-size: 1rem;
    color: white;
    padding: 5px 12px;
    background-color: transparent;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;

    &.SearchSortPopoverButton-Selected {
      background-color: ${theme.palette.background.light};
    }
  `
}
