import { Header } from "@/client/top/header.component"
import { Main } from "@/client/top/main.component"
import { css } from "@emotion/react"
import { Search } from "@/client/top/search/search.component"
import { memo, useCallback, useState } from "react"
import { Footer } from "@/client/top/footer.component"
import { Environment, Product, ProductType } from "@/common/db.type"
import { ProductDialog } from "@/client/top/product-dialog.component"

export const TopPage = memo(function TopPage({
  products: initialProducts,
  productTypes: initialProductTypes,
  environment: initialEnvironment,
  selectedProduct,
}: {
  products: Product[]
  productTypes: ProductType[]
  environment: Environment
  selectedProduct?: Product
}) {
  const [open, setOpen] = useState(true)
  const closeDialog = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <>
      {selectedProduct && (
        <ProductDialog product={selectedProduct} open={open} onClose={closeDialog} environment={initialEnvironment} />
      )}
      <div css={topPageStyles}>
        <Header environment={initialEnvironment} />
        <Search productTypes={initialProductTypes} />
        <Main products={initialProducts} environment={initialEnvironment} />
        <Footer />
      </div>
    </>
  )
})

function topPageStyles() {
  return css`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  `
}
