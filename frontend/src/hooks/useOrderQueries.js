import { finishOrder } from "@apis/orderApi";
import { useMutation } from "@tanstack/react-query";

export const useFinishOrder = () => {
  return useMutation({
    mutationFn: ({
      name,
      email,
      phone,
      address,
      note,
      order_items,
      total_price,
    }) =>
      finishOrder({
        name,
        email,
        phone,
        address,
        note,
        order_items,
        total_price,
      }),
    onSuccess: () => {
      // Do something after successfully finishing order
    },
  });
};
