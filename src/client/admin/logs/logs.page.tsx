import { css } from "@emotion/react"
import { useLogs } from "@/client/admin/logs/logs.hook"
import { memo, useCallback, useRef } from "react"
import { LogsCharge } from "@/client/admin/logs/charge.component"
import { InferGetServerSidePropsType } from "next"
import { getServerSideProps } from "@/pages/admin/logs"

export const LogsPage = memo(function LogsPage({
  productTypes: initialProductTypes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, fetchMore, hasMore, isLoading } = useLogs()

  const observerRef = useRef<IntersectionObserver>()
  const setupObserver = useCallback(
    (node: HTMLElement | null) => {
      observerRef.current?.disconnect()
      observerRef.current = new IntersectionObserver(async (entries) => {
        if (isLoading) return
        if (!hasMore) return
        if (!entries[0].isIntersecting) return
        await fetchMore()
      })

      if (node) {
        observerRef.current?.observe(node)
      }
    },
    [fetchMore, hasMore, isLoading]
  )

  return (
    <main css={loggingPageStyles}>
      <h1 className="Logs-Title">Logs</h1>
      <div>
        {data.map((charge) => (
          <LogsCharge key={charge.id} charge={charge} productTypes={initialProductTypes} ref={setupObserver} />
        ))}
      </div>
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
