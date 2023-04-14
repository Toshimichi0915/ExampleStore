import { Charge } from "@/common/db.type"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

export function useCharge(initialCharge: Charge): Charge {

  const [ charge, setCharge ] = useState(initialCharge)

  useQuery([ "charge", charge.id ], async () => {
    const response = await fetch(`/api/charges/${charge.id}`)
    if (!response.ok) throw new Error(`Failed to fetch charge: ${response.statusText}`)
    return await response.json()
  }, {
    onSuccess(data: Charge) {
      setCharge(data)
    },
  })

  return charge
}
