import { LogsPage } from "@/client/admin/logs/logs.page"
import { getProductTypes } from "@/server/db"

export default LogsPage

export async function getServerSideProps() {
  const productTypes = await getProductTypes()

  return {
    props: {
      productTypes,
    },
  }
}
