import { SettingsPage } from "@/client/admin/settings/settings.page"
import { getEnvironment, getProductTypes } from "@/server/db"

export default SettingsPage

export async function getServerSideProps() {
  const productTypes = await getProductTypes()
  const environment = await getEnvironment()

  return {
    props: {
      productTypes,
      environment,
    },
  }
}
