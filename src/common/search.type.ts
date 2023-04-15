import { z } from "zod"

export const sortOptions = [ "new", "old", "expensive", "cheap" ] as const

export type SortOption = typeof sortOptions[number]

export const SearchSchema = z.object({
  query: z.string().default(""),
  types: z.array(z.string()).default([]),
  sort: z.enum(sortOptions).default("new"),
})

export type SearchInput = z.input<typeof SearchSchema>
