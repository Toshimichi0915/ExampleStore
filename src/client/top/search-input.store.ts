import { create } from "zustand"
import { SortOption } from "@/common/search.type"

export interface SearchInputStore {
  changed: boolean
  query: string

  setQuery(query: string): void

  sort: SortOption

  setSort(sort: SortOption): void

  types: string[]

  addType(type: string): void

  removeType(type: string): void
}

export const useSearchInputStore = create<SearchInputStore>((set) => ({
  changed: false,

  query: "",
  setQuery(query) {
    set({ query, changed: true })
  },

  sort: "expensive",
  setSort(sort) {
    set({ sort, changed: true })
  },

  types: [],
  addType(type: string) {
    set((state) => ({ types: [...state.types, type], changed: true }))
  },
  removeType(type: string) {
    set((state) => ({ types: state.types.filter((t) => t !== type), changed: true }))
  },
}))
