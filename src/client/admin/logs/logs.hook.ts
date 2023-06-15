import { Charge } from "@/common/db.type"
import { useInfiniteQuery } from "@tanstack/react-query"
import { LogSchema } from "@/pages/api/logs"
import { z } from "zod"
import { useMemo } from "react"

export interface LogSearchResult {
  data: Charge[]

  fetchMore(): void

  hasMore: boolean
  isLoading: boolean
}

export function useLogs(): LogSearchResult {
  const { data, fetchNextPage, isLoading, hasNextPage } = useInfiniteQuery(
    ["logs"],
    async ({ pageParam }) => {
      const data = await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: pageParam,
          skip: pageParam ? 1 : 0,
          take: 20,
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

  return useMemo(
    () => ({
      data: data?.pages.flatMap((it) => it) ?? [],
      fetchMore: fetchNextPage,
      hasMore: hasNextPage ?? false,
      isLoading,
    }),
    [data, fetchNextPage, hasNextPage, isLoading]
  )
}
