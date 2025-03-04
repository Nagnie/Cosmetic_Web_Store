import { create } from "zustand";

const useCartStore = create((set) => ({
  isCartDrawerOpen: false,
  toggleCartDrawer: () =>
    set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
}));

export default useCartStore;
