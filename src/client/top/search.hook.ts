import { useQuery } from "@tanstack/react-query"
import { SearchInput } from "@/common/search.type"
import { Product } from "@/common/db.type"
import { useEffect } from "react"

export function useSearch(input: SearchInput, initialData: Product[]): Product[] {
  const { data, refetch } = useQuery(
    ["search"],
    async () => {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) throw new Error(`Failed to search: ${response.statusText}`)
      return await response.json()
    },
    {
      initialData,
    }
  )

  useEffect(() => {
    refetch().catch((e) => console.error(e))
  }, [input, refetch])

  return data
}
