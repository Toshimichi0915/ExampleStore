import { ProductType } from "@/common/db.type"
import { useProductTypes } from "@/client/top/search/product-type.hook"
import { css } from "@emotion/react"
import { SearchTypeButton } from "@/client/top/search/type-button.component"

export function SearchType({
  className,
  productTypes: initialProductTypes,
}: {
  className?: string
  productTypes: ProductType[]
}) {
  const productTypes = useProductTypes(initialProductTypes)

  return (
    <div css={searchTypeStyles} className={className}>
      {productTypes.map((type) => (
        <SearchTypeButton key={type.name} productType={type} />
      ))}
    </div>
  )
}

function searchTypeStyles() {
  return css`
    display: flex;
    gap: 20px;
  `
}
