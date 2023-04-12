import { Charge } from "@/common/product"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"

export interface PurchaseHistory {
  history: Charge[]
  loaded: boolean
}

export function usePurchaseHitory(): PurchaseHistory {
  const [history, setHistory] = useState<Charge[]>([])
  const [loaded, setLoaded] = useState(false)

  const { data, isSuccess } = useQuery(["charges"], async () => {
    const response = await fetch("/api/charges")
    if (!response.ok) return []
    return await response.json()
  })

  useEffect(() => {
    setHistory(data)
    setLoaded(isSuccess)
  }, [data, isSuccess])

  return useMemo(
    () => ({
      history,
      loaded,
    }),
    [history, loaded]
  )
}
