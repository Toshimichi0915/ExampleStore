import { useCallback, useRef } from "react"
import { UseInfiniteQueryResult } from "@tanstack/react-query"

export function useObserver(res: UseInfiniteQueryResult): (node: HTMLElement | null) => void {
  const observerRef = useRef<IntersectionObserver>()
  return useCallback(
    (node: HTMLElement | null) => {
      observerRef.current?.disconnect()
      observerRef.current = new IntersectionObserver(async (entries) => {
        if (res.isLoading) return
        if (!res.hasNextPage) return
        if (!entries[0].isIntersecting) return
        await res.fetchNextPage()
      })

      if (node) {
        observerRef.current?.observe(node)
      }
    },
    [res]
  )
}
