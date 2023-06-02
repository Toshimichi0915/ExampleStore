import { ProductType } from "@/common/db.type"
import { useSearchInputStore } from "@/client/top/search-input.store"
import { useCallback, useMemo } from "react"
import { Theme } from "@mui/material"
import { css } from "@emotion/react"

export function SearchFilterPopoverButton({ className, type }: { className?: string; type: ProductType }) {
  const [types, addType, removeType] = useSearchInputStore((state) => [state.types, state.addType, state.removeType])
  const selected = types.includes(type.name)

  const updateCurrentFilter = useCallback(() => {
    if (selected) {
      removeType(type.name)
    } else {
      addType(type.name)
    }
  }, [addType, removeType, selected, type])

  const classNames = useMemo(() => {
    const values = ["FilterPopoverButton"]

    if (selected) {
      values.push("FilterPopoverButton-Selected")
    }

    if (className) {
      values.push(className)
    }

    return values
  }, [className, selected])

  return (
    <button css={searchFilterPopoverButtonStyles} className={classNames.join(" ")} onClick={updateCurrentFilter}>
      {type.name}
    </button>
  )
}

function searchFilterPopoverButtonStyles(theme: Theme) {
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

    &.FilterPopoverButton-Selected {
      background-color: ${theme.palette.background.light};
    }
  `
}
