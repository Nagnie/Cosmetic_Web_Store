import { create } from "zustand";

export const useSearchStore = create((set) => ({
  searchText: "",
  setSearchText: (text) => set({ searchText: text }),
  clearSearchText: () => set({ searchText: "" }),
}));
