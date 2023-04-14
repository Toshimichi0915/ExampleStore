import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { Charge } from "@/common/db.type"

export interface PurchaseHistory {
  history: Charge[]
  loaded: boolean
}

export function usePurchaseHistory(): PurchaseHistory {
  const { data, isSuccess } = useQuery([ "products", "charges" ], async () => {
    const response = await fetch("/api/charges")
    if (!response.ok) throw new Error(`Failed to fetch charges: ${response.statusText}`)
    return await response.json()
  })

  return useMemo(
    () => ({
      history: data,
      loaded: isSuccess,
    }),
    [ data, isSuccess ],
  )
}
