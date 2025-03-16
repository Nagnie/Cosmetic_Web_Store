import { finishOrder } from "@apis/orderApi";
import { useMutation } from "@tanstack/react-query";

export const useFinishOrder = ({
  name,
  email,
  phone,
  address,
  note,
  order_items,
}) => {
  return useMutation({
    mutationFn: () =>
      finishOrder({ name, email, phone, address, note, order_items }),
    onSuccess: () => {
      // Do something after successfully finishing order
    },
  });
};
