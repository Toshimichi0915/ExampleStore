import { z } from "zod"

export const ChargeCreateSchema = z.object({
  productId: z.string(),
})

export interface ChargeCreateResponse {
  id: string
}
