import { css } from "@emotion/react"
import { useInfiniteLogs } from "@/client/admin/logs/logs.hook"
import { memo } from "react"
import { LogsCharge } from "@/client/admin/logs/charge.component"
import { InferGetServerSidePropsType } from "next"
import { getServerSideProps } from "@/pages/admin/logs"
import InfiniteScroll from "react-infinite-scroll-component"

export const LogsPage = memo(function LogsPage({
  productTypes: initialProductTypes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, hasMore, fetchMore } = useInfiniteLogs()

  return (
    <main css={loggingPageStyles}>
      <h1 className="Logs-Title">Logs</h1>
      <InfiniteScroll next={fetchMore} hasMore={hasMore} loader="Loading..." dataLength={data.length}>
        {data.map((charge) => (
          <LogsCharge key={charge.id} charge={charge} productTypes={initialProductTypes} />
        ))}
      </InfiniteScroll>
    </main>
  )
})

function loggingPageStyles() {
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

    & .Logs-Title {
      margin-bottom: 0;
    }
  `
}
