import { SearchQuery } from "@/client/top/search/query.component"
import { css } from "@emotion/react"
import { SearchSort } from "@/client/top/search/sort.component"
import { ProductType } from "@/common/db.type"
import { SearchType } from "@/client/top/search/type.component"

export function Search({ className, productTypes }: { className?: string, productTypes: ProductType[] }) {
  return (
    <div css={searchStyles} className={className}>
      <SearchType productTypes={productTypes} />
      <div className="Search-Bottom">
        <SearchQuery />
        <SearchSort />
      </div>
    </div>
  )
}

function searchStyles() {
  return css`
    padding: 20px 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    & .Search-Bottom {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }

  `
}
