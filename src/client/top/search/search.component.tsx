import { SearchQuery } from "@/client/top/search/query.component"
import { css } from "@emotion/react"
import { SearchSort } from "@/client/top/search/sort.component"
import { ProductType } from "@/common/db.type"
import { SearchType } from "@/client/top/search/type.component"
import { useMediaQuery } from "@mui/material"
import { SearchCurrentFilter } from "@/client/top/search/current-filter.component"
import { SearchFilter } from "@/client/top/search/filter.component"

export function Search({ className, productTypes }: { className?: string; productTypes: ProductType[] }) {
  const isMobile = !useMediaQuery("(min-width: 768px)")

  if (isMobile) {
    return (
      <div css={searchStyles} className={className}>
        <SearchQuery />
        <div className="Search-Mobile">
          <SearchCurrentFilter className="Search-SearchCurrentFilter" />
          <SearchFilter productTypes={productTypes} />
          <SearchSort />
        </div>
      </div>
    )
  } else {
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

    & .Search-Mobile {
      display: flex;
      width: 80%;
      margin: auto;
    }

    & .Search-SearchCurrentFilter {
      flex: 1;
    }
  `
}
