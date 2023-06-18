import { z } from "zod"

export const sortOptions = ["expensive", "cheap", "new", "old"] as const

export type SortOption = (typeof sortOptions)[number]

export const SearchSchema = z.object({
  cursor: z.string().optional(),
  take: z.number().default(100),
  skip: z.number().default(0),
  query: z.string().default(""),
  types: z.array(z.string()).default([]),
  sort: z.enum(sortOptions).default("expensive"),
})
