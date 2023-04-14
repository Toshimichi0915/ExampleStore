import { Button, Theme, useTheme } from "@mui/material"
import { ProductType, PurchasedProduct } from "@/common/db.type"
import { ReactNode, useCallback, useState } from "react"
import { paperStyles } from "@/client/common/styles"
import { ProductEditDialog } from "@/client/admin/settings/dialog/product.component"
import { ProductTypeEditDialog } from "@/client/admin/settings/dialog/product-type.component"
import { useSettings } from "@/client/admin/settings/settings.hook"
import { css } from "@emotion/react"
import { ProductTableRow, ProductTypeTableRow } from "@/client/admin/settings/row"
import { InferGetServerSidePropsType } from "next"
import { getServerSideProps } from "@/pages/admin/settings"

export function TableColumn({
                              children,
                              onEdit,
                              onDelete,
                            }: {
  children: ReactNode
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex justify-between items-center">
      <p className="my-0">{children}</p>
      <div className="flex">
        <Button onClick={onEdit}>EDIT</Button>
        <Button onClick={onDelete}>Delete</Button>
      </div>
    </div>
  )
}

export function SettingsPage({
                               products: initialProducts,
                               productTypes: initialProductTypes,
                             }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const theme = useTheme()
  const [ productEditDialogOpen, setProductEditDialogOpen ] = useState(false)
  const [ productTypeEditDialogOpen, setProductTypeEditDialogOpen ] = useState(false)

  const openProductEditDialog = useCallback(() => {
    setProductEditDialogOpen(true)
  }, [])

  const closeProductEditDialog = useCallback(() => {
    setProductEditDialogOpen(false)
  }, [])

  const openProductTypeEditDialog = useCallback(() => {
    setProductTypeEditDialogOpen(true)
  }, [])

  const closeProductTypeEditDialog = useCallback(() => {
    setProductTypeEditDialogOpen(false)
  }, [])

  const { products, productTypes } = useSettings(initialProducts, initialProductTypes)

  return (
    <>
      <ProductEditDialog open={productEditDialogOpen} onClose={closeProductEditDialog} productTypes={productTypes} />
      <ProductTypeEditDialog open={productTypeEditDialogOpen} onClose={closeProductTypeEditDialog} />
      <main css={settingsPageStyles}>
        <h1 className="Title">Settings</h1>
        <section className="ProductType">
          <div className="TableHeader">
            <h2 className="TableTitle">Product Types</h2>
            <Button className="AddButton" onClick={openProductTypeEditDialog}>Add new...</Button>
          </div>
          <div css={paperStyles(theme)}>
            {productTypes.length > 0 ? (
              <div className="TableBody">
                {productTypes.map((productType: ProductType) => (
                  <ProductTypeTableRow key={productType.name} productType={productType} />
                ))}
              </div>
            ) : (
              <p className="Empty">Empty :(</p>
            )}
          </div>
        </section>
        <section className="Product">
          <div className="TableHeader">
            <h2 className="TableTitle">Products</h2>
            <Button className="AddButton" onClick={openProductEditDialog}>Add new...</Button>
          </div>
          <div css={paperStyles(theme)}>
            {
              products.length > 0 ? (
                <div className="TableBody">
                  {products.map((product: PurchasedProduct) => (
                    <ProductTableRow key={product.id} product={product} productTypes={productTypes} />
                  ))}
                </div>
              ) : (
                <p className="Empty">Empty :(</p>
              )}
          </div>
        </section>
      </main>
    </>
  )
}

function settingsPageStyles(theme: Theme) {
  return css`
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    gap: 40px;
    @media (min-width: 768px) {
      padding: 40px 100px;
    }
    @media (min-width: 1024px) {
      padding: 40px 200px;
    }
    @media (min-width: 1280px) {
      padding: 40px 0;
      margin: auto;
      width: 1024px;
    }

    & .ProductType {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    & .TableHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    & .TableTitle {
      margin: 8px 0;
    }

    & .AddButton {
      color: white;
      padding-left: 12px;
      padding-right: 12px;
      background-color: ${theme.palette.primary.dark};
    }

    & .TableBody {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    & .Empty {
      margin: 3px 0;
    }
  `
}
