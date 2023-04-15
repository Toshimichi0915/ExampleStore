import { z } from "zod"

export const PasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
})

export type PasswordInput = z.input<typeof PasswordSchema>
