import { Charge, PurchasedProduct } from "@/common/db.type"
import { useCallback, useMemo, useState } from "react"

export interface PendingChargeSearchResult {
  pending: boolean
  errored: boolean
  charge: undefined
  product: undefined
}

export interface SuccessfulChargeSearchResult {
  pending: boolean
  errored: boolean
  charge: Charge
  product: PurchasedProduct
}

type ChargeSearchResult = PendingChargeSearchResult | SuccessfulChargeSearchResult

export interface ChargeSearch {
  chargeId: string
  setChargeId: (id: string) => void
  result: ChargeSearchResult

  search(): void
}

const initialChargeSearchResult: ChargeSearchResult = {
  pending: false,
  errored: false,
  charge: undefined,
  product: undefined,
}

export function useChargeSearch(): ChargeSearch {
  const [chargeId, setChargeId] = useState("")
  const [result, setResult] = useState<ChargeSearchResult>(initialChargeSearchResult)

  const search = useCallback(async () => {
    try {
      setResult({ pending: true, errored: false, charge: undefined, product: undefined })
      if (!chargeId) {
        setResult(initialChargeSearchResult)
        return
      }
      const chargeRes = await fetch(`/api/charges/${chargeId}`)
      if (chargeRes.status == 404) {
        setResult(initialChargeSearchResult)
        return
      }
      const charge = await chargeRes.json()

      const productRes = await fetch(`/api/products/${charge.productId}`)
      if (!productRes.ok) throw new Error(`Failed to fetch product: ${productRes.statusText}`)
      const product = await productRes.json()

      setResult({
        pending: false,
        errored: false,
        charge,
        product,
      })
    } catch (e) {
      setResult({ pending: false, errored: true, charge: undefined, product: undefined })
      console.error(e)
    }
  }, [chargeId])

  return useMemo(
    () => ({
      chargeId,
      setChargeId,
      result,
      search,
    }),
    [chargeId, result, search]
  )
}
