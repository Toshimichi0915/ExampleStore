import { useSearchInputStore } from "@/client/top/search-input.store"
import { useCallback, useMemo } from "react"
import { ProductType } from "@/common/db.type"
import { Theme } from "@mui/material"
import { css } from "@emotion/react"

export function SearchTypeButton({ className, productType }: { className?: string, productType: ProductType }) {

  const [ types, addType, removeType ] = useSearchInputStore((state) => ([ state.types, state.addType, state.removeType ]))
  const selected = types.includes(productType.name)

  const toggleType = useCallback(() => {
    if (selected) {
      removeType(productType.name)
    } else {
      addType(productType.name)
    }
  }, [ addType, productType.name, removeType, selected ])

  const classNames = useMemo(() => {
    const values = [ "SearchTypeButton" ]

    if (selected) {
      values.push("SearchTypeButton-Selected")
    }

    if (className) {
      values.push(className)
    }

    return values
  }, [ className, selected ])

  return (
    <button onClick={toggleType} css={searchTypeButtonStyles} className={classNames.join(" ")}>
      {productType.name}
    </button>
  )
}

function searchTypeButtonStyles(theme: Theme) {
  return css`
    padding: 2px 10px;
    background-color: transparent;
    border: none;
    border-radius: 9999px;
    color: white;
    font-size: 1.1rem;
    font-family: ${theme.typography.fontFamily};
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &.SearchTypeButton-Selected {
      background-color: ${theme.palette.background.light};
    }
  `
}
