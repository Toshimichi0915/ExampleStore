import { TosPage } from "@/client/tos/tos.page"
import { getEnvironment } from "@/server/db"

export default TosPage

export async function getServerSideProps() {
  const environment = await getEnvironment()

  return {
    props: {
      environment,
    },
  }
}
