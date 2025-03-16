import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useCartStore } from "@components/Cart";
import {
  addItemToCart,
  fetchCartItems,
  removeCartItem,
  updateCartItem,
} from "@apis/cartApi";

export const useAddCartItem = () => {
  const queryClient = useQueryClient();
  const { openCartDrawer, itemCount, setItemCount } = useCartStore();

  return useMutation({
    mutationFn: (item) => addItemToCart(item),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["infiniteCartItems", { limit: 10 }],
      });

      setItemCount(itemCount + variables.quantity);

      openCartDrawer();
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const { setItemCount } = useCartStore();

  return useMutation({
    mutationFn: (item) => removeCartItem(item),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["infiniteCartItems", { limit: 10 }],
      });

      setItemCount((prev) => prev - variables.quantity);
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item) => updateCartItem(item),
    onSuccess: () => {
      // console.log("onSuccess updateCartItem");
      queryClient.invalidateQueries({
        queryKey: ["infiniteCartItems", { limit: 10 }],
      });

      // queryClient.setQueryData(["infiniteCartItems", { limit: 10 }], (old) => {
      //   console.log("old", old);
      //   const updatedDate = data.updatedItem[0];
      //   console.log("data", updatedDate);
      //   return {
      //     ...old,
      //     pages: old.pages.map((page) => {
      //       return {
      //         ...page,
      //         data: page.data.map((item) => {
      //           if (item.id_pro === updatedDate.id_pro) {
      //             return {
      //               ...item,
      //               quantity: updatedDate.quantity,
      //               pro_price: Number(updatedDate.pro_price),
      //             };
      //           }
      //           return item;
      //         }),
      //       };
      //     }),
      //   };
      // });
    },
  });
};

export const useInfiniteCartItems = ({ limit = 10, enabled = true } = {}) => {
  return useInfiniteQuery({
    queryKey: ["infiniteCartItems", { limit }],
    queryFn: async ({ pageParam = 1, signal }) => {
      const data = await fetchCartItems({ page: pageParam, limit, signal });
      return data;
    },
    getNextPageParam: (lastPage) => {
      // Check if there's actually a next page
      if (
        lastPage &&
        lastPage.total_pages &&
        Number(lastPage.page) < lastPage.total_pages
      ) {
        console.log("Next page:", Number(lastPage.page) + 1);
        return Number(lastPage.page) + 1;
      }
      // Return undefined to stop infinite scroll
      return undefined;
    },
    enabled,
  });
};
