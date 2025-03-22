import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set) => ({
      // UI state
      isCartDrawerOpen: false,
      itemCount: 0,
      totalPrice: 0,
      discountInfo: null,

      // Actions
      toggleCartDrawer: () =>
        set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),

      // Cập nhật số lượng items
      setItemCount: (count) => set({ itemCount: count }),

      // Cập nhật tổng giá tiền
      setTotalPrice: (price) => set({ totalPrice: price }),

      // Cập nhật thông tin giảm giá
      setDiscountInfo: (info) => set({ discountInfo: info }),

      // Reset giỏ hàng
      clearCart: () =>
        set({
          itemCount: 0,
          totalPrice: 0,
          isCartDrawerOpen: false,
          discountInfo: null,
        }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        itemCount: state.itemCount,
        totalPrice: state.totalPrice,
      }),
    },
  ),
);

export default useCartStore;
