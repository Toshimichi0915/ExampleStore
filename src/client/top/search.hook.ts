import { useInfiniteQuery } from "@tanstack/react-query"
import { Product } from "@/common/db.type"
import { useMemo } from "react"
import { z } from "zod"
import { SearchSchema } from "@/common/search.type"
import { useSearchInputStore } from "@/client/top/search-input.store"

export interface SearchResult {
  data: Product[]
  isLoading: boolean
  hasMore: boolean

  fetchMore(): void
}

export function useSearch(initialData: Product[]): SearchResult {
  const [query, types, sort, changed] = useSearchInputStore(
    (state) => [state.query, state.types, state.sort, state.changed] as const
  )

  const result = useInfiniteQuery(
    ["search", [query, types, sort]],
    async ({ pageParam }) => {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cursor: pageParam,
          skip: pageParam ? 1 : 0,
          query,
          types,
          sort,
        } satisfies z.input<typeof SearchSchema>),
      })

      if (!response.ok) throw new Error(`Failed to search: ${response.statusText}`)
      return (await response.json()) as Product[]
    },
    {
      getNextPageParam(current) {
        if (current.length > 0) {
          return current[current.length - 1].id
        } else {
          return undefined
        }
      },
      ...(!changed && {
        initialData: {
          pages: [initialData],
          pageParams: [undefined],
        },
      }),
      staleTime: Infinity,
    }
  )

  return useMemo(
    () => ({
      data: result.data?.pages.flatMap((it) => it) ?? [],
      isLoading: result.isLoading,
      hasMore: result.hasNextPage ?? false,
      fetchMore: result.fetchNextPage,
    }),
    [result.data?.pages, result.fetchNextPage, result.hasNextPage, result.isLoading]
  )
}
