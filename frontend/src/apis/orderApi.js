import axios from "@utils/axios";

export const finishOrder = async ({
  name,
  email,
  phone,
  address,
  note,
  order_items,
}) => {
  const response = await axios.post("/order/finish", {
    name,
    email,
    phone,
    address,
    note,
    order_items,
  });
  return response.data;
};
