import { create } from "zustand";

const useCartStore = create((set) => ({
  // UI State
  isCartDrawerOpen: false,
  itemCount: 0,

  // Các Actions
  toggleCartDrawer: () =>
    set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),

  setItemCount: (count) => set({ itemCount: count }),
}));

export default useCartStore;
