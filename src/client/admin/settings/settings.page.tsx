import { useSettings } from "@/client/admin/settings/settings.hook"
import { css } from "@emotion/react"
import { InferGetServerSidePropsType } from "next"
import { getServerSideProps } from "@/pages/admin/settings"
import { SettingsPassword } from "@/client/admin/settings/password.component"
import { SettingsSignOut } from "@/client/admin/settings/signout.component"
import { SettingsProducts, SettingsProductTypes } from "@/client/admin/settings/table.component"
import { SettingsEnvironment } from "@/client/admin/settings/environment.component"

export function SettingsPage({
  products: initialProducts,
  productTypes: initialProductTypes,
  environment: initialEnvironment,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { products, productTypes } = useSettings(initialProducts, initialProductTypes)

  return (
    <>
      <main css={settingsPageStyles}>
        <h1 className="Settings-Title">Settings</h1>
        <SettingsProductTypes productTypes={productTypes} />
        <SettingsProducts products={products} productTypes={productTypes} />
        <SettingsEnvironment environment={initialEnvironment} />
        <SettingsPassword />
        <SettingsSignOut />
      </main>
    </>
  )
}

function settingsPageStyles() {
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
  `
}
