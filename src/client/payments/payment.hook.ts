import { Charge } from "@/common/db.type"
import { useQuery } from "@tanstack/react-query"

export function useCharge(initialCharge: Charge): Charge {
  const { data } = useQuery(
    ["charge", initialCharge.id],
    async () => {
      const response = await fetch(`/api/charges/${initialCharge.id}`)
      if (!response.ok) throw new Error(`Failed to fetch charge: ${response.statusText}`)
      return await response.json()
    },
    {
      initialData: initialCharge,
      refetchInterval: 10000,
    }
  )

  return data
}
