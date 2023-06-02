import { create } from "zustand"
import { SortOption } from "@/common/search.type"

export interface SearchInputStore {
  query: string

  setQuery(query: string): void

  sort: SortOption

  setSort(sort: SortOption): void

  types: string[]

  addType(type: string): void

  removeType(type: string): void
}

export const useSearchInputStore = create<SearchInputStore>((set) => ({
  query: "",
  setQuery(query) {
    set({ query })
  },

  sort: "expensive",
  setSort(sort) {
    set({ sort })
  },

  types: [],
  addType(type: string) {
    set((state) => ({ types: [...state.types, type] }))
  },
  removeType(type: string) {
    set((state) => ({ types: state.types.filter((t) => t !== type) }))
  },
}))
