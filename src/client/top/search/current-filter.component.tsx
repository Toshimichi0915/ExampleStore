import { useSearchInputStore } from "@/client/top/search-input.store"
import { css } from "@emotion/react"

export function SearchCurrentFilter({ className }: { className?: string }) {
  const types = useSearchInputStore((state) => state.types)

  let typeName: string
  if (types.length > 1) {
    typeName = `(${types.length} Selected)`
  } else if (types.length == 1) {
    typeName = types[0]
  } else {
    typeName = "All"
  }

  return (
    <div css={searchCurrentFilterStyles} className={className}>
      {typeName}
    </div>
  )
}

function searchCurrentFilterStyles() {
  return css`
    font-size: 1.1rem;
  `
}
