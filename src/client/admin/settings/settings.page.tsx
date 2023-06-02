import { Button, TextField, Theme, useTheme } from "@mui/material"
import { ProductType, PurchasedProduct } from "@/common/db.type"
import { ChangeEvent, useCallback, useState } from "react"
import { paperStyles } from "@/client/common/styles"
import { ProductEditDialog } from "@/client/admin/settings/dialog/product.component"
import { ProductTypeEditDialog } from "@/client/admin/settings/dialog/product-type.component"
import { useSettings } from "@/client/admin/settings/settings.hook"
import { css } from "@emotion/react"
import { ProductTableRow, ProductTypeTableRow } from "@/client/admin/settings/row"
import { InferGetServerSidePropsType } from "next"
import { getServerSideProps } from "@/pages/admin/settings"
import { usePassword } from "@/client/admin/settings/password.hook"
import { signOut } from "next-auth/react"

export function SettingsPage({
  products: initialProducts,
  productTypes: initialProductTypes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const theme = useTheme()
  const [productEditDialogOpen, setProductEditDialogOpen] = useState(false)
  const [productTypeEditDialogOpen, setProductTypeEditDialogOpen] = useState(false)

  const openProductEditDialog = useCallback(() => setProductEditDialogOpen(true), [])
  const closeProductEditDialog = useCallback(() => setProductEditDialogOpen(false), [])
  const openProductTypeEditDialog = useCallback(() => setProductTypeEditDialogOpen(true), [])
  const closeProductTypeEditDialog = useCallback(() => setProductTypeEditDialogOpen(false), [])

  const { products, productTypes } = useSettings(initialProducts, initialProductTypes)

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const { update, successMessage, errorMessage } = usePassword()

  const changeOldPassword = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setOldPassword(event.target.value),
    []
  )
  const changeNewPassword = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value),
    []
  )
  const updatePassword = useCallback(() => update(oldPassword, newPassword), [update, oldPassword, newPassword])

  const logout = useCallback(() => signOut(), [])

  return (
    <>
      <ProductEditDialog open={productEditDialogOpen} onClose={closeProductEditDialog} productTypes={productTypes} />
      <ProductTypeEditDialog open={productTypeEditDialogOpen} onClose={closeProductTypeEditDialog} />
      <main css={settingsPageStyles}>
        <h1 className="Settings-Title">Settings</h1>
        <section className="Settings-ProductType">
          <div className="Settings-TableHeader">
            <h2 className="Settings-TableTitle">Product Types</h2>
            <Button className="Settings-AddButton" onClick={openProductTypeEditDialog}>
              Add new...
            </Button>
          </div>
          <div css={paperStyles(theme)}>
            {productTypes.length > 0 ? (
              <div className="Settings-TableBody">
                {productTypes.map((productType: ProductType) => (
                  <ProductTypeTableRow key={productType.name} productType={productType} />
                ))}
              </div>
            ) : (
              <p className="Settings-Empty">Empty :(</p>
            )}
          </div>
        </section>
        <section className="Settings-Product">
          <div className="Settings-TableHeader">
            <h2 className="Settings-TableTitle">Products</h2>
            <Button className="Settings-AddButton" onClick={openProductEditDialog}>
              Add new...
            </Button>
          </div>
          <div css={paperStyles(theme)}>
            {products.length > 0 ? (
              <div className="Settings-TableBody">
                {products.map((product: PurchasedProduct) => (
                  <ProductTableRow key={product.id} product={product} productTypes={productTypes} />
                ))}
              </div>
            ) : (
              <p className="Settings-Empty">Empty :(</p>
            )}
          </div>
        </section>
        <section className="Settings-Password">
          <h2 className="Settings-PasswordTitle">Password</h2>
          <div className="Settings-PasswordForm">
            {successMessage && <p className="Settings-PasswordFormSuccess">{successMessage}</p>}
            {errorMessage && <p className="Settings-PasswordFormError">{errorMessage}</p>}
            <TextField label="Old Password" type="password" value={oldPassword} onChange={changeOldPassword} />
            <TextField label="New Password" type="password" value={newPassword} onChange={changeNewPassword} />
            <Button onClick={updatePassword}>Click To Change</Button>
          </div>
        </section>
        <section className="Settings-SignOut">
          <h2 className="Settings-SignOut">Sign Out</h2>
          <Button onClick={logout}>Click to Sign Out</Button>
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

    & .Settings-Title {
      margin-bottom: 0;
    }

    & .Settings-ProductType {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    & .Settings-TableHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    & .Settings-TableTitle,
    & .Settings-PasswordTitle,
    & .Settings-SignOutTitle {
      margin: 8px 0;
    }

    & .Settings-AddButton {
      color: white;
      padding-left: 12px;
      padding-right: 12px;
      background-color: ${theme.palette.primary.dark};
    }

    & .Settings-TableBody {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    & .Settings-Empty {
      margin: 3px 0;
    }

    & .Settings-PasswordForm {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    & .Settings-PasswordFormSuccess {
      color: #4caf50;
      margin: 0;
    }

    & .Settings-PasswordFormError {
      color: red;
      margin: 0;
    }
  `
}
