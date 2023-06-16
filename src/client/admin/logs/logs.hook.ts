import { Charge } from "@/common/db.type"
import { useInfiniteQuery } from "@tanstack/react-query"
import { LogSchema } from "@/pages/api/logs"
import { z } from "zod"
import { useMemo } from "react"
import { useObserver } from "@/client/common/infinite.hook"

export interface LogSearchResult {
  data: Charge[]
  isLoading: boolean

  setupObserver(element: HTMLElement | null): void
}

export function useInfiniteLogs(): LogSearchResult {
  const result = useInfiniteQuery(
    ["logs"],
    async ({ pageParam }) => {
      const data = await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cursor: pageParam,
          skip: pageParam ? 1 : 0,
        } satisfies z.input<typeof LogSchema>),
      })

      return (await data.json()) as Charge[]
    },
    {
      getNextPageParam(current) {
        if (current.length > 0) {
          return current[current.length - 1].id
        } else {
          return undefined
        }
      },
    }
  )

  const setupObserver = useObserver(result)

  return useMemo(
    () => ({
      data: result.data?.pages.flatMap((it) => it) ?? [],
      isLoading: result.isLoading,
      setupObserver,
    }),
    [result, setupObserver]
  )
}
