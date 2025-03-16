import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useCartStore } from "@components/Cart";
import { addItemToCart } from "@apis/cartApi";

export const useAddCartItem = () => {
  const queryClient = useQueryClient();
  const { openCartDrawer, itemCount, setItemCount } = useCartStore();

  return useMutation({
    mutationFn: (item) => addItemToCart(item),
    onSuccess: (_, variables) => {
      console.log("variables", variables);
      queryClient.invalidateQueries({
        queryKey: ["cartItems"],
      });

      setItemCount(itemCount + variables.quantity);

      openCartDrawer();
    },
  });
};
